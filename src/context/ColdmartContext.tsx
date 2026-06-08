import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, Product, Sale, AffiliationRule, Ticket, LandingPage, 
  TransferRequest, UserRole, ProductType, CourseModule, Lesson, QuizQuestion
} from '../types';
import { 
  DEFAULT_USERS, DEFAULT_PRODUCTS, DEFAULT_SALES, 
  DEFAULT_AFFILIATIONS, DEFAULT_TICKETS, DEFAULT_PAGES, DEFAULT_TRANSFERS 
} from '../defaultData';
import { enrichProductData } from '../utils/quizCommentGenerator';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

interface ColdmartContextType {
  users: User[];
  currentUser: User | null;
  products: Product[];
  sales: Sale[];
  affiliations: AffiliationRule[];
  tickets: Ticket[];
  pages: LandingPage[];
  transfers: TransferRequest[];
  buyerEnrolledIds: string[]; // List of product IDs bought by the buyer
  
  // Actions
  switchRole: (role: UserRole) => void;
  updateUserProfile: (name: string, email: string, avatar: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'creatorId' | 'creatorName' | 'rating' | 'ratingCount' | 'enrolledCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  approveProduct: (id: string) => void;
  rejectProduct: (id: string) => void;
  requestAffiliation: (productId: string) => void;
  incrementClicks: (code: string) => void;
  processPurchase: (params: {
    buyerName: string;
    buyerEmail: string;
    productId: string;
    paymentMethod: 'pix' | 'credit_card' | 'boleto' | 'paypal';
    couponCode?: string;
    affiliateCode?: string;
    orderBump?: boolean;
    orderBumpProductId?: string;
  }) => { success: boolean; saleId: string; totalAmount: number };
  requestWithdrawal: (amount: number, pixKey: string) => { success: boolean; message: string };
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
  
  // Page Builder Actions
  updateLandingPage: (productId: string, page: LandingPage) => void;
  getLandingPage: (productId: string) => LandingPage;
  
  // Tickets Support Actions
  createSupportTicket: (subject: string, category: 'payment' | 'access' | 'partnership' | 'other', initialMessage: string) => void;
  replyToTicket: (ticketId: string, text: string, sender: 'user' | 'support' | 'ai') => void;
  resolveTicket: (ticketId: string) => void;

  // Members Area
  toggleLessonCompletion: (productId: string, lessonId: string) => void;
  submitCourseRating: (productId: string, rating: number) => void;

  // New Auth Gateways
  signupUser: (name: string, email: string, role: UserRole, password?: string) => User;
  loginUser: (email: string, password?: string) => User | null;
  logoutUser: () => void;
}

const ColdmartContext = createContext<ColdmartContextType | undefined>(undefined);

export const ColdmartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [users, setUsers] = useState<User[]>(() => {
    const raw = localStorage.getItem('coldmart_users');
    return raw ? JSON.parse(raw) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('coldmart_current_user');
    return raw ? JSON.parse(raw) : null;
  });

  const getCategoryFallbackImage = (category: string): string => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('marketing') || cat.includes('negócio') || cat.includes('business')) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('program') || cat.includes('tecnologia') || cat.includes('tech') || cat.includes('desenvolvi')) {
      return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('finan') || cat.includes('dinheiro') || cat.includes('invest')) {
      return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('fit') || cat.includes('acad') || cat.includes('espor') || cat.includes('saú') || cat.includes('saud')) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('idioma') || cat.includes('espanh') || cat.includes('ingl') || cat.includes('franc') || cat.includes('ital')) {
      return 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('educa') || cat.includes('estud') || cat.includes('escor') || cat.includes('monogra') || cat.includes('tcc')) {
      return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
  };

  const [products, setProducts] = useState<Product[]>(() => {
    const raw = localStorage.getItem('coldmart_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Map to ensure any product has a valid, non-empty, fully formed URL image
      const updated = parsed.map((p: any) => {
        const defaultProd = DEFAULT_PRODUCTS.find(dp => dp.id === p.id);
        
        let finalImage = p.image || '';
        if (defaultProd) {
          finalImage = defaultProd.image || p.image || '';
        }
        
        // Treat placeholder strings or empty strings as invalid, assigning fallbacks
        if (!finalImage || typeof finalImage !== 'string' || finalImage.trim() === '' || !finalImage.startsWith('http')) {
          finalImage = getCategoryFallbackImage(p.category || defaultProd?.category || '');
        }

        if (defaultProd) {
          return {
            ...p,
            title: defaultProd.title,
            description: defaultProd.description,
            price: defaultProd.price,
            commission: defaultProd.commission,
            category: defaultProd.category,
            image: finalImage,
            type: defaultProd.type,
            modules: defaultProd.modules && defaultProd.modules.length > 0 ? defaultProd.modules : p.modules,
          };
        }
        
        return {
          ...p,
          image: finalImage
        };
      });
      
      const updatedIds = new Set(updated.map((p: any) => p.id));
      const missingDefaults = DEFAULT_PRODUCTS.filter(p => !updatedIds.has(p.id));
      return [...updated, ...missingDefaults].map(enrichProductData);
    }
    
    // Fallback if no local storage exists: map default products to ensure all have solid covers
    return DEFAULT_PRODUCTS.map(p => {
      if (!p.image || typeof p.image !== 'string' || p.image.trim() === '' || !p.image.startsWith('http')) {
        return {
          ...p,
          image: getCategoryFallbackImage(p.category)
        };
      }
      return p;
    }).map(enrichProductData);
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const raw = localStorage.getItem('coldmart_sales');
    return raw ? JSON.parse(raw) : DEFAULT_SALES;
  });

  const [affiliations, setAffiliations] = useState<AffiliationRule[]>(() => {
    const raw = localStorage.getItem('coldmart_affiliations');
    return raw ? JSON.parse(raw) : DEFAULT_AFFILIATIONS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const raw = localStorage.getItem('coldmart_tickets');
    return raw ? JSON.parse(raw) : DEFAULT_TICKETS;
  });

  const [pages, setPages] = useState<LandingPage[]>(() => {
    const raw = localStorage.getItem('coldmart_pages');
    return raw ? JSON.parse(raw) : DEFAULT_PAGES;
  });

  const [transfers, setTransfers] = useState<TransferRequest[]>(() => {
    const raw = localStorage.getItem('coldmart_transfers');
    return raw ? JSON.parse(raw) : DEFAULT_TRANSFERS;
  });

  // Dynamically compute enrolled products for the logged in user based on completed sales matching their email
  const buyerEnrolledIds = useMemo(() => {
    if (!currentUser) return [];
    
    const userCompletedSales = sales.filter(
      s => s.buyerEmail.toLowerCase() === currentUser.email.toLowerCase() && s.status === 'completed'
    );
    
    return Array.from(new Set(userCompletedSales.map(s => s.productId)));
  }, [sales, currentUser]);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('coldmart_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('coldmart_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('coldmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('coldmart_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('coldmart_affiliations', JSON.stringify(affiliations));
  }, [affiliations]);

  useEffect(() => {
    localStorage.setItem('coldmart_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('coldmart_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('coldmart_transfers', JSON.stringify(transfers));
  }, [transfers]);

  // Seeding initial data to Firebase if collections are empty
  useEffect(() => {
    const seedDatabaseRef = async () => {
      if (!db) return;
      try {
        const checkAndSeed = async (colName: string, defaults: any[]) => {
          const colRef = collection(db, colName);
          const snapshot = await getDocs(colRef);
          if (snapshot.empty) {
            console.log(`[Firebase] Seeding empty collection '${colName}' with default dataset...`);
            for (const item of defaults) {
              await setDoc(doc(db, colName, item.id), item);
            }
          }
        };
        await checkAndSeed('users', DEFAULT_USERS);
        await checkAndSeed('products', DEFAULT_PRODUCTS);
        await checkAndSeed('sales', DEFAULT_SALES);
        await checkAndSeed('affiliations', DEFAULT_AFFILIATIONS);
        await checkAndSeed('tickets', DEFAULT_TICKETS);
        await checkAndSeed('pages', DEFAULT_PAGES);
        await checkAndSeed('transfers', DEFAULT_TRANSFERS);
        console.log("[Firebase] Seeding process checked completed.");
      } catch (err) {
        console.warn("[Firebase] Seeding warning (likely restricted permissions or setup delay):", err);
      }
    };
    seedDatabaseRef();
  }, []);

  // Sync state in real-time from active Firestore collections (where permissions allow)
  useEffect(() => {
    if (!db) return;

    const safeSync = <T,>(
      colName: string,
      setData: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
      try {
        return onSnapshot(
          collection(db, colName),
          (snapshot) => {
            if (!snapshot.empty) {
              const list: T[] = [];
              snapshot.forEach((d) => {
                list.push(d.data() as T);
              });
              setData(list);
            }
          },
          (error) => {
            console.log(`[Firebase] Firestore read restricted/denied on '${colName}' (handled safely using offline fallback):`, error.message);
          }
        );
      } catch (err) {
        console.warn(`[Firebase] Error attaching snapshot on '${colName}':`, err);
      }
    };

    const unsubUsers = safeSync<User>('users', setUsers);
    const unsubProducts = safeSync<Product>('products', setProducts);
    const unsubSales = safeSync<Sale>('sales', setSales);
    const unsubAffiliations = safeSync<AffiliationRule>('affiliations', setAffiliations);
    const unsubTickets = safeSync<Ticket>('tickets', setTickets);
    const unsubPages = safeSync<LandingPage>('pages', setPages);
    const unsubTransfers = safeSync<TransferRequest>('transfers', setTransfers);

    return () => {
      unsubUsers?.();
      unsubProducts?.();
      unsubSales?.();
      unsubAffiliations?.();
      unsubTickets?.();
      unsubPages?.();
      unsubTransfers?.();
    };
  }, []);


  // Actions implementation
  const switchRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      // Create lazy user profile if missing
      const newUser: User = {
        id: `usr_${role}`,
        name: role.charAt(0).toUpperCase() + role.slice(1) + ' Coldmart',
        email: `${role}@coldmart.com.br`,
        role,
        balance: role === 'admin' ? 84000 : role === 'buyer' ? 0 : 1500,
        balancePending: 0,
        avatar: role === 'admin' 
          ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);

      // Sincronizar com Firebase
      if (db) {
        setDoc(doc(db, 'users', newUser.id), newUser).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `users/${newUser.id}`);
        });
      }
    }
  };

  const updateUserProfile = (name: string, email: string, avatar: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, email, avatar };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'users', updated.id), updated).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${updated.id}`);
      });
    }
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'creatorId' | 'creatorName' | 'rating' | 'ratingCount' | 'enrolledCount'>) => {
    if (!currentUser) return;
    const id = `prod_${Date.now()}`;
    
    let finalImg = newProd.image || '';
    if (!finalImg || typeof finalImg !== 'string' || finalImg.trim() === '' || !finalImg.startsWith('http')) {
      finalImg = getCategoryFallbackImage(newProd.category);
    }

    const product: Product = {
      ...newProd,
      image: finalImg,
      id,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      rating: 0,
      ratingCount: 0,
      enrolledCount: 0,
      status: 'active' // Immediately added to the public marketplace as requested
    };

    setProducts(prev => [product, ...prev]);

    // Create a default builder page for this product
    const newPage: LandingPage = {
      id: `page_${id}`,
      productId: id,
      theme: 'modern',
      sections: [
        {
          id: `sec_${id}_1`,
          type: 'hero',
          content: {
            title: `Aprenda tudo sobre ${product.title}`,
            description: `A descrição ideal do seu negócio e como a metodologia vai beneficiar seu cliente para faturamento.`,
            ctaText: 'Comprar Agora',
          }
        },
        {
          id: `sec_${id}_2`,
          type: 'features',
          content: {
            title: 'O que você vai dominar',
            description: 'Tópicos ensinados detalhadamente passo-a-passo.',
            items: [
              'Conceito Inicial Passo a Passo',
              'Práticas de Excelência do mercado',
              'Controle completo de rotinas',
              'Certificado definitivo Coldmart'
            ]
          }
        },
        {
          id: `sec_${id}_3`,
          type: 'cta',
          content: {
            title: 'Comece a transformar sua realidade hoje',
            description: `${product.description}`,
            ctaText: 'Quero Garantir Meu Acesso',
          }
        }
      ]
    };
    setPages(prev => [newPage, ...prev]);

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'products', product.id), product).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
      });
      setDoc(doc(db, 'pages', newPage.id), newPage).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `pages/${newPage.id}`);
      });
    }
  };

  const updateProduct = (updatedProd: Product) => {
    let finalImg = updatedProd.image || '';
    if (!finalImg || typeof finalImg !== 'string' || finalImg.trim() === '' || !finalImg.startsWith('http')) {
      finalImg = getCategoryFallbackImage(updatedProd.category);
    }
    const sanitized = {
      ...updatedProd,
      image: finalImg
    };
    setProducts(prev => prev.map(p => p.id === sanitized.id ? sanitized : p));

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'products', sanitized.id), sanitized).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `products/${sanitized.id}`);
      });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    // Sincronizar com Firebase
    if (db) {
      deleteDoc(doc(db, 'products', id)).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
      });
    }
  };

  const approveProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));

    // Sincronizar com Firebase
    if (db) {
      updateDoc(doc(db, 'products', id), { status: 'active' }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
      });
    }
  };

  const rejectProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));

    // Sincronizar com Firebase
    if (db) {
      updateDoc(doc(db, 'products', id), { status: 'rejected' }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
      });
    }
  };

  const requestAffiliation = (productId: string) => {
    if (!currentUser || currentUser.role !== 'affiliate') return;
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    // Check if already affiliated
    const exists = affiliations.find(a => a.affiliateId === currentUser.id && a.productId === productId);
    if (exists) return;

    const code = `COLD_${targetProduct.title.substring(0, 3).toUpperCase()}_${Math.floor(100 + Math.random() * 900)}`;
    const newAff: AffiliationRule = {
      id: `aff_${Date.now()}`,
      affiliateId: currentUser.id,
      productId,
      productTitle: targetProduct.title,
      productPrice: targetProduct.price,
      commissionPercent: targetProduct.commission,
      linkCode: code,
      clicks: 0,
      salesCount: 0,
      earnings: 0
    };

    setAffiliations(prev => [...prev, newAff]);

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'affiliations', newAff.id), newAff).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `affiliations/${newAff.id}`);
      });
    }
  };

  const incrementClicks = (code: string) => {
    setAffiliations(prev => prev.map(aff => {
      if (aff.linkCode === code) {
        const updated = { ...aff, clicks: aff.clicks + 1 };
        // Sincronizar com Firebase
        if (db) {
          updateDoc(doc(db, 'affiliations', aff.id), { clicks: updated.clicks }).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `affiliations/${aff.id}`);
          });
        }
        return updated;
      }
      return aff;
    }));
  };

  const processPurchase = (params: {
    buyerName: string;
    buyerEmail: string;
    productId: string;
    paymentMethod: 'pix' | 'credit_card' | 'boleto' | 'paypal';
    couponCode?: string;
    affiliateCode?: string;
    orderBump?: boolean;
    orderBumpProductId?: string;
  }) => {
    const mainProd = products.find(p => p.id === params.productId);
    if (!mainProd) return { success: false, saleId: '', totalAmount: 0 };

    let totalAmount = mainProd.price;
    // Apply dummy coupon
    if (params.couponCode && params.couponCode.trim().toUpperCase() === 'COLD10') {
      totalAmount = totalAmount * 0.9; // 10% OFF
    }

    let bumpProd: Product | undefined;
    if (params.orderBump && params.orderBumpProductId) {
      bumpProd = products.find(p => p.id === params.orderBumpProductId);
      if (bumpProd) {
        totalAmount += bumpProd.price;
      }
    }

    const saleId = `sale_${Date.now()}`;
    const dateStr = new Date().toISOString();

    const createTransaction = (prod: Product, originalPrice: number) => {
      let finalPrice = originalPrice;
      if (params.couponCode && params.couponCode.trim().toUpperCase() === 'COLD10' && prod.id === mainProd.id) {
        finalPrice = finalPrice * 0.9;
      }

      // 5% administrator commission
      const adminCommission = finalPrice * 0.05;
      let affiliateCommission = 0;
      let affiliateId: string | null = null;

      // Check affiliate attribution if available
      if (params.affiliateCode) {
        const affRule = affiliations.find(a => a.linkCode === params.affiliateCode && a.productId === prod.id);
        if (affRule) {
          affiliateId = affRule.affiliateId;
          // Split calculation based on the product’s commission percent of the product price
          affiliateCommission = finalPrice * (affRule.commissionPercent / 100);
        }
      }

      const creatorCommission = finalPrice - adminCommission - affiliateCommission;

      const newSale: Sale = {
        id: `${saleId}_${prod.id}`,
        productId: prod.id,
        productTitle: prod.title,
        productImage: prod.image,
        amount: finalPrice,
        buyerName: params.buyerName,
        buyerEmail: params.buyerEmail,
        status: params.paymentMethod === 'boleto' ? 'pending' : 'completed',
        paymentMethod: params.paymentMethod,
        creatorCommission,
        affiliateCommission,
        adminCommission,
        affiliateId,
        date: dateStr,
      };

      // Push sale to list
      setSales(prev => [newSale, ...prev]);

      // Sincronizar com Firebase
      if (db) {
        setDoc(doc(db, 'sales', newSale.id), newSale).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, `sales/${newSale.id}`);
        });
      }

      if (params.paymentMethod !== 'boleto') {
        // Adjust product enrollment count
        setProducts(prev => prev.map(p => {
          if (p.id === prod.id) {
            const updated = { ...p, enrolledCount: p.enrolledCount + 1 };
            if (db) {
              updateDoc(doc(db, 'products', p.id), { enrolledCount: updated.enrolledCount }).catch(() => {});
            }
            return updated;
          }
          return p;
        }));

        // Update admin balance with the 5% administrative commission
        setUsers(prev => prev.map(u => {
          if (u.role === 'admin') {
            const updated = {
              ...u,
              balance: Number((u.balance + adminCommission).toFixed(2))
            };
            if (db) {
              updateDoc(doc(db, 'users', u.id), { balance: updated.balance }).catch(() => {});
            }
            if (currentUser && currentUser.id === u.id) {
              setCurrentUser(updated);
            }
            return updated;
          }
          return u;
        }));

        // Update creator balance
        setUsers(prev => prev.map(u => {
          if (u.id === prod.creatorId) {
            const updated = {
              ...u,
              balance: Number((u.balance + creatorCommission).toFixed(2))
            };
            if (db) {
              updateDoc(doc(db, 'users', u.id), { balance: updated.balance }).catch(() => {});
            }
            if (currentUser && currentUser.id === u.id) {
              setCurrentUser(updated);
            }
            return updated;
          }
          return u;
        }));

        // Update affiliate balance if applicable
        if (affiliateId) {
          setUsers(prev => prev.map(u => {
            if (u.id === affiliateId) {
              const updated = {
                ...u,
                balance: Number((u.balance + affiliateCommission).toFixed(2))
              };
              if (db) {
                updateDoc(doc(db, 'users', u.id), { balance: updated.balance }).catch(() => {});
              }
              if (currentUser && currentUser.id === u.id) {
                setCurrentUser(updated);
              }
              return updated;
            }
            return u;
          }));

          // Track affiliate sales metrics
          setAffiliations(prev => prev.map(a => {
            if (a.linkCode === params.affiliateCode && a.productId === prod.id) {
              const updated = {
                ...a,
                salesCount: a.salesCount + 1,
                earnings: Number((a.earnings + affiliateCommission).toFixed(2))
              };
              if (db) {
                setDoc(doc(db, 'affiliations', a.id), updated).catch(() => {});
              }
              return updated;
            }
            return a;
          }));
        }
      }
    };

    // Process main purchase
    createTransaction(mainProd, mainProd.price);

    // Process Order Bump if enabled
    if (bumpProd) {
      createTransaction(bumpProd, bumpProd.price);
    }

    return { success: true, saleId, totalAmount };
  };

  const requestWithdrawal = (amount: number, pixKey: string) => {
    if (!currentUser) return { success: false, message: 'Nenhum usuário logado.' };
    
    if (amount <= 0) {
      return { success: false, message: 'O valor do saque precisa ser maior que zero.' };
    }
    
    if (currentUser.balance < amount) {
      return { success: false, message: 'Saldo disponível insuficiente para realizar este saque.' };
    }

    // Deduct from current user balance and log transfer
    const newRequest: TransferRequest = {
      id: `trsf_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      status: 'pending',
      pixKey,
      date: new Date().toISOString()
    };

    const updatedUser = {
      ...currentUser,
      balance: Number((currentUser.balance - amount).toFixed(2)),
      balancePending: Number((currentUser.balancePending + amount).toFixed(2)) // Move to pending-clearing while review is active
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setTransfers(prev => [newRequest, ...prev]);

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'transfers', newRequest.id), newRequest).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `transfers/${newRequest.id}`);
      });
      setDoc(doc(db, 'users', updatedUser.id), updatedUser).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${updatedUser.id}`);
      });
    }

    return { success: true, message: 'Solicitação de saque enviada com sucesso! Aguarde aprovação.' };
  };

  const approveWithdrawal = (id: string) => {
    const req = transfers.find(t => t.id === id);
    if (!req) return;

    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    
    // Sincronizar transferência com Firebase
    if (db) {
      updateDoc(doc(db, 'transfers', id), { status: 'approved' }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `transfers/${id}`);
      });
    }

    // Clear the pending balance from the target user
    setUsers(prev => prev.map(u => {
      if (u.id === req.userId) {
        const pending = Math.max(0, u.balancePending - req.amount);
        const updated = { ...u, balancePending: Number(pending.toFixed(2)) };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updated);
        }
        
        // Sincronizar usuário com Firebase
        if (db) {
          updateDoc(doc(db, 'users', u.id), { balancePending: updated.balancePending }).catch(() => {});
        }
        return updated;
      }
      return u;
    }));
  };

  const rejectWithdrawal = (id: string) => {
    const req = transfers.find(t => t.id === id);
    if (!req) return;

    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));

    // Sincronizar transferência com Firebase
    if (db) {
      updateDoc(doc(db, 'transfers', id), { status: 'rejected' }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `transfers/${id}`);
      });
    }

    // Refund available balance to the target user
    setUsers(prev => prev.map(u => {
      if (u.id === req.userId) {
        const pending = Math.max(0, u.balancePending - req.amount);
        const updated = { 
          ...u, 
          balance: Number((u.balance + req.amount).toFixed(2)), 
          balancePending: Number(pending.toFixed(2)) 
        };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updated);
        }

        // Sincronizar usuário com Firebase
        if (db) {
          updateDoc(doc(db, 'users', u.id), { 
            balance: updated.balance, 
            balancePending: updated.balancePending 
          }).catch(() => {});
        }
        return updated;
      }
      return u;
    }));
  };

  const updateLandingPage = (productId: string, updatedPage: LandingPage) => {
    setPages(prev => {
      const exists = prev.find(p => p.productId === productId);
      if (exists) {
        return prev.map(p => p.productId === productId ? updatedPage : p);
      } else {
        return [...prev, updatedPage];
      }
    });

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'pages', updatedPage.id), updatedPage).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `pages/${updatedPage.id}`);
      });
    }
  };

  const getLandingPage = (productId: string): LandingPage => {
    const found = pages.find(p => p.productId === productId);
    if (found) return found;
    // Return a default mockup page structure
    return {
      id: `page_${productId}`,
      productId,
      theme: 'cosmic',
      sections: [
        {
          id: `sec_${productId}_d1`,
          type: 'hero',
          content: {
            title: 'Oferta Especial do Produto',
            description: 'Carregando estrutura de vendas.',
            ctaText: 'Garantir Acesso',
          }
        }
      ]
    };
  };

  const createSupportTicket = (subject: string, category: 'payment' | 'access' | 'partnership' | 'other', initialMessage: string) => {
    if (!currentUser) return;
    const ticketId = `tick_${Date.now()}`;
    const dateStr = new Date().toISOString();

    const newTicket: Ticket = {
      id: ticketId,
      userEmail: currentUser.email,
      userName: currentUser.name,
      subject,
      status: 'open',
      category,
      date: dateStr,
      messages: [
        {
          id: `msg_${Date.now()}_1`,
          sender: 'user',
          text: initialMessage,
          date: dateStr
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'tickets', newTicket.id), newTicket).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `tickets/${newTicket.id}`);
      });
    }

    // Simulated instant Support AI Assistant answering
    setTimeout(() => {
      let aiText = `Olá, ${currentUser.name}! Eu sou o ColdBot AI, o assistente inteligente da Coldmart. `;
      if (category === 'payment') {
        aiText += `Entendi que a sua dúvida é referente a pagamentos ou transações. Caso tenha feito um pagamento via Pix ou Cartão, a liberação ocorre em apenas 3 minutos no seu e-mail. Se for boleto bancário, a compensação pode levar até 48 horas úteis pelos bancos parceiros. Nosso time de auditoria também foi alertado sobre o assunto e responderá pessoalmente logo em breve!`;
      } else if (category === 'access') {
        aiText += `Caso esteja enfrentando dificuldades para acessar a área de membros, certifique-se de estar logado com seu e-mail cadastrado (${currentUser.email}). Acesse com a mesma conta e navegue pela aba 'Minhas Compras' no topo do seu painel! Se precisar redefinir senha, clique em 'Esqueci minha senha' na tela de início.`;
      } else if (category === 'partnership') {
        aiText += `Perfeito, vejo que sua dúvida é sobre nosso programa de afiliados e taxas de indicação de produtos digitais. Lembre-se que as comissões são pagas de forma instantânea diretamente na sua carteira virtual assim que a venda compensa! Ficamos felizes em ter você como parceiro de tráfego.`;
      } else {
        aiText += `Recebemos sua mensagem com sucesso. Um especialista do time de suporte da Coldmart de plantão analisará sua solicitação técnica e enviará um feedback diretamente para o e-mail cadastrado. Estou aqui para agilizar o que for preciso!`;
      }

      replyToTicket(ticketId, aiText, 'ai');
    }, 1500);
  };

  const replyToTicket = (ticketId: string, text: string, sender: 'user' | 'support' | 'ai') => {
    const newMessage = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 100)}`,
      sender,
      text,
      date: new Date().toISOString()
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = {
          ...t,
          messages: [...t.messages, newMessage]
        };

        // Sincronizar com Firebase
        if (db) {
          setDoc(doc(db, 'tickets', ticketId), updated).catch((err) => {
            handleFirestoreError(err, OperationType.WRITE, `tickets/${ticketId}`);
          });
        }

        // If the user replied, schedule another automated AI quick chat companion check
        if (sender === 'user') {
          setTimeout(() => {
            const textLower = text.toLowerCase();
            let aiAnswerText = 'Recebi sua mensagem adicional sobre o chamado. ';
            
            if (textLower.includes('saque') || textLower.includes('dinheiro') || textLower.includes('retirar') || textLower.includes('pix') || textLower.includes('saldo')) {
              aiAnswerText += 'Para efetuar transferências de seu faturamento líquido liberado, acesse o painel e solicite o Saque Instantâneo inserindo sua chave Pix. O processamento sob demanda ocorre em menos de 10 minutos após verificação cadastral de rotina.';
            } else if (textLower.includes('comissao') || textLower.includes('afiliado') || textLower.includes('link') || textLower.includes('venda')) {
              aiAnswerText += 'Sobre o programa comercial de afiliados: as porcentagens de comissão variam entre 10% e 80% definidas pelo autor. Todas as indicações faturadas com seu código exclusivo geram créditos automáticos na sua carteira virtual na hora da compensação.';
            } else if (textLower.includes('taxa') || textLower.includes('custo') || textLower.includes('pagar') || textLower.includes('mensalidade')) {
              aiAnswerText += 'A Coldmart adota um modelo de ganho mútuo: cobramos apenas 5% de taxa por checkout aprovado, que é destinado integralmente ao administrador. Não coletamos anuidades, mensalidades ou comissões adicionais fixas para liberar o visualizador e construtor de ofertas.';
            } else if (textLower.includes('curso') || textLower.includes('membros') || textLower.includes('aula') || textLower.includes('video') || textLower.includes('certificado')) {
              aiAnswerText += 'Referente à Área de Membros: as aulas concluídas acumulam pontuação de progresso. Após assistir todos os conteúdos obrigatórios e responder os Quizzes, seu Certificado Executivo Oficial é emitido e anexado para transferência.';
            } else if (textLower.includes('pagina') || textLower.includes('builder') || textLower.includes('landing') || textLower.includes('copiar') || textLower.includes('criar')) {
              aiAnswerText += 'No Construtor Visual (Page Builder), você desfruta de customização de blocos, ajuste de cores Bento, escolha de templates e ferramenta de Copy de IA integrada para formular propostas persuasivas.';
            } else {
              aiAnswerText += `Compreendi sua mensagem sobre "${text}". O ColdBot AI registrou suas especificidades técnicas de infraestrutura e alertou o time executivo de staff de plantão para te entregar suporte complementar.`;
            }

            const botMsg = {
              id: `msg_${Date.now()}_bot`,
              sender: 'ai' as const,
              text: aiAnswerText,
              date: new Date().toISOString()
            };
            setTickets(innerPrev => innerPrev.map(innerT => {
              if (innerT.id === ticketId) {
                const subUpdated = { ...innerT, messages: [...innerT.messages, botMsg] };
                if (db) {
                  setDoc(doc(db, 'tickets', ticketId), subUpdated).catch(() => {});
                }
                return subUpdated;
              }
              return innerT;
            }));
          }, 1500);
        }

        return updated;
      }
      return t;
    }));
  };

  const resolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, status: 'resolved' as const };
        if (db) {
          updateDoc(doc(db, 'tickets', ticketId), { status: 'resolved' }).catch(() => {});
        }
        return updated;
      }
      return t;
    }));
  };

  const toggleLessonCompletion = (productId: string, lessonId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedModules = p.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l)
        }));
        const updatedProduct = { ...p, modules: updatedModules };

        if (db) {
          setDoc(doc(db, 'products', productId), updatedProduct).catch(() => {});
        }
        return updatedProduct;
      }
      return p;
    }));
  };

  const submitCourseRating = (productId: string, rating: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newCount = p.ratingCount + 1;
        const newRating = Number(((p.rating * p.ratingCount + rating) / newCount).toFixed(1));
        const updatedProduct = {
          ...p,
          rating: newRating,
          ratingCount: newCount
        };

        if (db) {
          setDoc(doc(db, 'products', productId), updatedProduct).catch(() => {});
        }
        return updatedProduct;
      }
      return p;
    }));
  };

  const signupUser = (name: string, email: string, role: UserRole, password?: string): User => {
    if (role === 'admin') {
      throw new Error('Não é permitido criar novas contas com o perfil de Administrador.');
    }

    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('Este endereço de e-mail já está cadastrado na Coldmart.');
    }

    if (password) {
      const pfxExists = users.find(u => u.password === password);
      if (pfxExists) {
        throw new Error('Esta senha já está em uso por outro usuário. Para sua segurança na Coldmart, escolha uma senha exclusiva.');
      }
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      balance: role === 'buyer' ? 0 : 2500,
      balancePending: 0,
      avatar: '', // New profiles MUST start without a photo
      password
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    // Sincronizar com Firebase
    if (db) {
      setDoc(doc(db, 'users', newUser.id), newUser).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${newUser.id}`);
      });
    }

    return newUser;
  };

  const loginUser = (email: string, password?: string): User | null => {
    let matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matched) {
      // Auto-inject missing preset users from DEFAULT_USERS so the Agile Test Channel keeps working flawlessly
      const defaultUser = DEFAULT_USERS.find(d => d.email.toLowerCase() === email.toLowerCase());
      if (defaultUser) {
        setUsers(prev => {
          const existsInState = prev.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (!existsInState) {
            return [...prev, defaultUser];
          }
          return prev;
        });
        matched = defaultUser;
      }
    }

    if (matched) {
      if (password !== undefined && matched.password && matched.password !== password) {
        throw new Error('Senha incorreta para esta conta.');
      }
      setCurrentUser(matched);
      return matched;
    }
    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('coldmart_current_user');
  };

  return (
    <ColdmartContext.Provider value={{
      users,
      currentUser,
      products,
      sales,
      affiliations,
      tickets,
      pages,
      transfers,
      buyerEnrolledIds,
      switchRole,
      updateUserProfile,
      addProduct,
      updateProduct,
      deleteProduct,
      approveProduct,
      rejectProduct,
      requestAffiliation,
      incrementClicks,
      processPurchase,
      requestWithdrawal,
      approveWithdrawal,
      rejectWithdrawal,
      updateLandingPage,
      getLandingPage,
      createSupportTicket,
      replyToTicket,
      resolveTicket,
      toggleLessonCompletion,
      submitCourseRating,
      signupUser,
      loginUser,
      logoutUser
    }}>
      {children}
    </ColdmartContext.Provider>
  );
};

export const useColdmart = () => {
  const context = useContext(ColdmartContext);
  if (context === undefined) {
    throw new Error('useColdmart must be used within a ColdmartProvider');
  }
  return context;
};
