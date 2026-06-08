export type UserRole = 'admin' | 'producer' | 'affiliate' | 'buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  balancePending: number;
  avatar: string;
  password?: string;
}

export type ProductType = 'course' | 'ebook' | 'subscription' | 'mentorship';

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  completed: boolean;
  description: string;
  materials: { name: string; url: string }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: ProductType;
  creatorId: string;
  creatorName: string;
  commission: number; // Percentage, e.g. 50
  status: 'pending_approval' | 'active' | 'rejected';
  rating: number;
  ratingCount: number;
  category: string;
  image: string;
  enrolledCount: number;
  modules: CourseModule[];
  quiz?: QuizQuestion[];
  classroomComments?: { name: string; text: string; date: string; isInstructor?: boolean }[];
}

export interface Sale {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  status: 'completed' | 'pending' | 'refunded';
  paymentMethod: 'pix' | 'credit_card' | 'boleto' | 'paypal';
  creatorCommission: number;
  affiliateCommission: number;
  affiliateId: string | null;
  date: string;
  adminCommission?: number;
}

export interface AffiliationRule {
  id: string;
  affiliateId: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  commissionPercent: number;
  linkCode: string;
  clicks: number;
  salesCount: number;
  earnings: number;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support' | 'ai';
  text: string;
  date: string;
}

export interface Ticket {
  id: string;
  userEmail: string;
  userName: string;
  subject: string;
  status: 'open' | 'resolved';
  category: 'payment' | 'access' | 'partnership' | 'other';
  messages: TicketMessage[];
  date: string;
}

export interface PageBuilderSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'faq' | 'cta';
  content: {
    title: string;
    description: string;
    ctaText?: string;
    items?: string[] | { name: string; role: string; text: string }[] | { q: string; a: string }[];
    backgroundImage?: string;
  };
}

export interface LandingPage {
  id: string;
  productId: string;
  theme: 'modern' | 'minimalist' | 'cosmic' | 'warm';
  sections: PageBuilderSection[];
}

export interface TransferRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  pixKey: string;
  date: string;
}
