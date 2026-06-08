import React, { useState, useEffect } from 'react';
import { useColdmart } from '../context/ColdmartContext';
import { Product, Lesson, CourseModule, QuizQuestion } from '../types';
import { 
  Play, Pause, ChevronRight, CheckSquare, Square, Download, 
  MessageSquare, Star, Award, BookOpen, Volume2, ShieldCheck, 
  ArrowRight, Sparkles, Check, CheckCircle2, ChevronDown, RefreshCw, Printer
} from 'lucide-react';

export const MemberAreaView: React.FC = () => {
  const { 
    products, 
    buyerEnrolledIds, 
    currentUser, 
    toggleLessonCompletion, 
    submitCourseRating,
    updateProduct
  } = useColdmart();

  // Active state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'quiz' | 'certificate'>('details');

  // Video controller simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState('1.0x');
  const [videoProgress, setVideoProgress] = useState(0); // value from 0 to 100%
  const [volume, setVolume] = useState(80);

  // Student reviews and quiz
  const [userComment, setUserComment] = useState('');
  const [classroomComments, setClassroomComments] = useState<{name: string, text: string, date: string, isInstructor?: boolean}[]>([]);

  const [studentRating, setStudentRating] = useState(5);
  const [hasRated, setHasRated] = useState(false);
  
  // Custom Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Achievements & Custom certificate stats
  const [quizPerfectBadge, setQuizPerfectBadge] = useState(false);
  const [certStudentName, setCertStudentName] = useState(currentUser?.name || '');

  // Filter enrolled products
  const enrolledProducts = products.filter(p => buyerEnrolledIds.includes(p.id));

  // Set default selection
  useEffect(() => {
    if (enrolledProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(enrolledProducts[0]);
    }
  }, [enrolledProducts, selectedProduct]);

  // Set default active lesson under chosen product
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.classroomComments) {
        setClassroomComments(selectedProduct.classroomComments);
      } else {
        setClassroomComments([]);
      }
      if (selectedProduct.modules.length > 0 && selectedProduct.modules[0].lessons.length > 0) {
        setActiveLesson(selectedProduct.modules[0].lessons[0]);
        // Reset quiz
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setQuizScore(0);
        setHasRated(false);
        setActiveTab('details');
        setIsPlaying(false);
        setVideoProgress(0);
      } else {
        setActiveLesson(null);
      }
    }
  }, [selectedProduct]);

  // Video player custom progress simulation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          // Auto complete lesson!
          if (selectedProduct && activeLesson) {
            toggleLessonCompletion(selectedProduct.id, activeLesson.id);
          }
          return 100;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, selectedProduct, activeLesson]);

  if (!currentUser) return null;

  // Calculate product overall completion %
  const calculateCompletion = (prod: Product) => {
    let totalLessons = 0;
    let completedLessons = 0;
    prod.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.completed) completedLessons++;
      });
    });
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  // Derived state for gamification
  let totalCompletedLessons = 0;
  let hasCompletedCourse = false;

  enrolledProducts.forEach(prod => {
    let courseComplete = true;
    let localTotal = 0;
    prod.modules.forEach(m => {
      m.lessons.forEach(l => {
        localTotal++;
        if (l.completed) {
          totalCompletedLessons++;
        } else {
          courseComplete = false;
        }
      });
    });
    if (localTotal > 0 && courseComplete) {
      hasCompletedCourse = true;
    }
  });

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    submitCourseRating(selectedProduct.id, studentRating);
    setHasRated(true);
    alert(`Obrigado! Sua nota de ${studentRating} estrelas foi salva com sucesso e computada nas métricas SaaS.`);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim() || !selectedProduct) return;

    const newComment = {
      name: currentUser.name,
      text: userComment,
      date: 'Agora mesmo'
    };

    const updatedComments = [...classroomComments, newComment];
    setClassroomComments(updatedComments);
    setUserComment('');

    // Update in Context to persist
    updateProduct({
      ...selectedProduct,
      classroomComments: updatedComments
    });

    // Trigger instructor / AI response mockup
    setTimeout(() => {
      const textLower = newComment.text.toLowerCase();
      let responseText = `Excelente pergunta, ${currentUser.name.split(' ')[0]}! `;
      
      if (textLower.includes('banco') || textLower.includes('sql') || textLower.includes('data') || textLower.includes('postgresql')) {
        responseText += `Para conectar o banco PostgreSQL ou configurar arquivos de persistência, garanta que o arquivo contendo a string de conexão esteja no arquivo .env. Certifique-se de realizar as migrações corretas utilizando o push de drizzle ou prisma correspondente.`;
      } else if (textLower.includes('erro') || textLower.includes('bug') || textLower.includes('consertar') || textLower.includes('falha') || textLower.includes('problema')) {
        responseText += `Investiguei sua menção a um comportamento inesperado. Na maioria das vezes, erros de carregamento residem em CORS ou caminhos relativos de importação. Abra as ferramentas de desenvolvedor (F12) e examine o Console de Erros para rastrear a linha exata.`;
      } else if (textLower.includes('certificado') || textLower.includes('pdf') || textLower.includes('concluir') || textLower.includes('conclusao')) {
        responseText += `O certificado executivo em formato PDF é gerado dinamicamente para download assim que suas barras de conclusão alcançarem 100%. Lembre-se de marcar as aulas concluídas no botão verde no topo do reprodutor!`;
      } else if (textLower.includes('cupom') || textLower.includes('desconto') || textLower.includes('comprar')) {
        responseText += `Cupons promocionais e testes de checkout de produtos digitais podem ser criados diretamente pelo perfil Produtor. Se você for comprar para validar, utilize o método Pix que realiza compensação autônoma imediata.`;
      } else {
        responseText += `Essa arquitetura corporativa da Coldmart apoia faturamentos exponenciais. Pratique codar os módulos propostos e certifique-se de que os estados de React estejam sincronizados com localStorage conforme orientamos. Estarei à disposição!`;
      }

      const instructorResponse = {
        name: 'ColdBot AI Tutor',
        text: responseText,
        date: 'Agora mesmo',
        isInstructor: true
      };

      const finalComments = [...updatedComments, instructorResponse];
      setClassroomComments(finalComments);
      
      updateProduct({
        ...selectedProduct,
        classroomComments: finalComments
      });
    }, 1800);
  };

  const handleQuizAnswer = (qId: string, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedProduct.quiz) return;

    let correct = 0;
    selectedProduct.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correct++;
      }
    });

    setQuizScore(correct);
    setQuizSubmitted(true);
    
    // Unlock perfect quiz badge if student scored 100%
    if (correct === selectedProduct.quiz.length) {
      setQuizPerfectBadge(true);
    }
  };

  // Fast Auto-completion simulator for current course
  const handleForceCompleteCourse = () => {
    if (!selectedProduct) return;
    selectedProduct.modules.forEach(m => {
      m.lessons.forEach(l => {
        if (!l.completed) {
          toggleLessonCompletion(selectedProduct.id, l.id);
        }
      });
    });
  };

  // Browser Print certificate trigger
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white">Minha Área de Membros</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Assista às suas aulas contratadas, realize quizzes avaliativos e emita seus certificados autorizados.</p>
      </div>

      {enrolledProducts.length === 0 ? (
        <div className="text-center py-16 border border-gray-200 dark:border-zinc-850 rounded-3xl bg-white dark:bg-zinc-950">
          <Award className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
          <h4 className="font-bold text-gray-900 dark:text-white text-base">Nenhum treinamento adquirido</h4>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
            Você ainda não possui inscrições de cursos autorizadas nesta conta de Aluno. Acesse o Marketplace público e simule a compra com um clique!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Bento Gamification & Achievements Cabinet */}
          {((totalCompletedLessons >= 1) || quizPerfectBadge || hasCompletedCourse) && (
            <section className="bg-zinc-50 dark:bg-zinc-900/30 border border-gray-150 dark:border-zinc-900 p-5 rounded-3xl space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5 font-mono">
                    <Award className="w-4 h-4 text-purple-500 shrink-0" />
                    Gamificação • Minhas Conquistas Escolares
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Assista às vídeo-aulas, gabarite os questionários simulados e emita seus diplomas credenciados.</p>
                </div>
                <div className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold font-mono px-3 py-1 rounded-full border border-purple-500/25 select-none shrink-0">
                  CREDENCIAIS: { (totalCompletedLessons >= 1 ? 1 : 0) + (totalCompletedLessons >= 3 ? 1 : 0) + (quizPerfectBadge ? 1 : 0) + (hasCompletedCourse ? 1 : 0) } / 4 DESBLOQUEADAS
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Badge 1: Pioneiro */}
                <div className={`p-3.5 rounded-2xl border shadow-sm flex items-center gap-3 transition-all ${
                  totalCompletedLessons >= 1 
                    ? 'bg-white dark:bg-zinc-950 border-gray-150 dark:border-zinc-850' 
                    : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-dashed border-gray-200 dark:border-zinc-900/60 opacity-60'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    totalCompletedLessons >= 1 ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-100 dark:bg-zinc-900 text-zinc-400'
                  }`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black dark:text-zinc-100 truncate">Pioneiro Aluno</p>
                      <span className={`text-[8px] px-1 py-0.2 rounded font-black font-mono uppercase ${
                        totalCompletedLessons >= 1 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                      }`}>
                        {totalCompletedLessons >= 1 ? 'Liberado' : 'Pedente'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-snug">Iniciou estudos na Coldmart</p>
                  </div>
                </div>

                {/* Badge 2: Maratonista */}
                <div className={`p-3.5 rounded-2xl border shadow-sm flex items-center gap-3 transition-all ${
                  totalCompletedLessons >= 3 
                    ? 'bg-white dark:bg-zinc-950 border-gray-150 dark:border-zinc-850' 
                    : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-dashed border-gray-200 dark:border-zinc-900/60 opacity-60'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    totalCompletedLessons >= 3 ? 'bg-orange-500/10 text-orange-500' : 'bg-gray-100 dark:bg-zinc-900 text-zinc-400'
                  }`}>
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black dark:text-zinc-100 truncate">Maratonista</p>
                      <span className={`text-[8px] px-1 py-0.2 rounded font-black font-mono uppercase ${
                        totalCompletedLessons >= 3 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                      }`}>
                        {totalCompletedLessons >= 3 ? 'Liberado' : '3 aulas req.'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-snug">Completou {totalCompletedLessons}/3 aulas</p>
                  </div>
                </div>

                {/* Badge 3: Cérebro de Aço */}
                <div className={`p-3.5 rounded-2xl border shadow-sm flex items-center gap-3 transition-all ${
                  quizPerfectBadge 
                    ? 'bg-white dark:bg-zinc-950 border-gray-150 dark:border-zinc-850' 
                    : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-dashed border-gray-200 dark:border-zinc-900/60 opacity-60'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    quizPerfectBadge ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-100 dark:bg-zinc-900 text-zinc-400'
                  }`}>
                    <Sparkles className="w-5 h-5 font-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black dark:text-zinc-100 truncate">Cérebro de Aço</p>
                      <span className={`text-[8px] px-1 py-0.2 rounded font-black font-mono uppercase ${
                        quizPerfectBadge ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                      }`}>
                        {quizPerfectBadge ? 'Liberado' : 'Falta Quiz 100%'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-snug">Acertou 100% em um Quiz</p>
                  </div>
                </div>

                {/* Badge 1: Graduado */}
                <div className={`p-3.5 rounded-2xl border shadow-sm flex items-center gap-3 transition-all ${
                  hasCompletedCourse 
                    ? 'bg-white dark:bg-zinc-950 border-gray-150 dark:border-zinc-850' 
                    : 'bg-zinc-50/50 dark:bg-zinc-900/10 border-dashed border-gray-200 dark:border-zinc-900/60 opacity-60'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    hasCompletedCourse ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 dark:bg-zinc-900 text-zinc-400'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black dark:text-zinc-100 truncate">Honrado Graduado</p>
                      <span className={`text-[8px] px-1 py-0.2 rounded font-black font-mono uppercase ${
                        hasCompletedCourse ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-150 dark:bg-zinc-900 text-zinc-400'
                      }`}>
                        {hasCompletedCourse ? 'Liberado' : 'Concluir 100%'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-snug">Concluiu qualquer curso</p>
                  </div>
                </div>

              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Courses / Sidebar navigation Left (1 Column) */}
          <aside className="space-y-6 lg:col-span-1">
            
            {/* Choose dynamic Enrolled course */}
            <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 rounded-2xl">
              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2 font-mono">Selecionar Meu Curso</label>
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const found = enrolledProducts.find(p => p.id === e.target.value);
                  if (found) setSelectedProduct(found);
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none dark:text-white cursor-pointer"
              >
                {enrolledProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Collapsible Module lesson sidebar panel */}
            {selectedProduct && (
              <div className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden h-fit">
                <div className="p-4 border-b border-gray-150 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/40">
                  <h3 className="font-bold text-xs text-gray-950 dark:text-white leading-tight truncate">{selectedProduct.title}</h3>
                  
                  {/* Progress panel wrapper */}
                  <div className="mt-3 space-y-1 text-xs font-semibold">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Seu progresso escolar:</span>
                      <span className="text-blue-500">{calculateCompletion(selectedProduct)}% concluído</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" 
                        style={{ width: `${calculateCompletion(selectedProduct)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Modules & Lectures list tree */}
                <div className="divide-y divide-gray-100 dark:divide-zinc-900 max-h-[380px] overflow-y-auto">
                  {selectedProduct.modules.length === 0 ? (
                    <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 py-6">Este curso não possui vídeo-aulas publicadas.</p>
                  ) : (
                    selectedProduct.modules.map((m) => (
                      <div key={m.id} className="p-3">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest line-clamp-1 mb-2 leading-tight flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          {m.title}
                        </p>
                        <div className="space-y-1">
                          {m.lessons.map((les) => (
                            <button
                              key={les.id}
                              onClick={() => {
                                setActiveLesson(les);
                                setIsPlaying(false);
                                setVideoProgress(0);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                                activeLesson?.id === les.id 
                                  ? 'bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-cyan-400 font-bold' 
                                  : 'text-zinc-650 dark:text-zinc-400'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span 
                                  onClick={(e) => {
                                    e.stopPropagation(); // Avoid triggering active lecture selection twice
                                    toggleLessonCompletion(selectedProduct.id, les.id);
                                  }}
                                  className="text-zinc-400 dark:text-zinc-700 hover:text-blue-500 dark:hover:text-cyan-400 shrink-0"
                                >
                                  {les.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </span>
                                <span className="truncate leading-none">{les.title}</span>
                              </div>
                              <span className="text-[9.5px] font-mono text-zinc-400 shrink-0">{les.duration}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Video Player and Classroom workspace Right (3 Columns) */}
          <main className="lg:col-span-3 space-y-6">
            {activeLesson ? (
              <div className="space-y-6">
                
                {/* Visual Video Player simulated Box */}
                <div className="overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl relative stage-box shrink-0">
                  
                  {/* High fidelity simulation screen canvas */}
                  <div className="aspect-video w-full relative flex items-center justify-center bg-zinc-900">
                    
                    {/* Animated gradients mock background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-zinc-900 to-indigo-950/40 opacity-70" />
                    
                    {/* Floating player graphics */}
                    {isPlaying ? (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-transform">
                        <div className="w-12 h-12 bg-white/10 dark:bg-black/20 rounded-full flex items-center justify-center text-white backdrop-blur-md animate-ping">
                          <Play className="w-5 h-5 fill-white" />
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all z-10 border border-white/10 cursor-pointer"
                      >
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </button>
                    )}

                    {/* Progress details indicator in front */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-black/55 backdrop-blur-md text-white text-[10px] font-mono whitespace-nowrap">
                      SESSÃO SECURED: CLOUDFLARE STREAM
                    </div>

                    {/* Simulating static cover image */}
                    {videoProgress === 0 && !isPlaying && (
                      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30" style={{ backgroundImage: `url(${selectedProduct?.image})` }} />
                    )}

                    {/* Visual progressing mock timeline inside screen */}
                    <div className="absolute bottom-16 right-4 z-10 text-[10px] font-mono text-zinc-300">
                      SPEED: {videoSpeed} | {Math.floor((videoProgress / 100) * 15)}:00 / 15:00 min
                    </div>
                  </div>

                  {/* Player custom controls row */}
                  <div className="p-4 bg-zinc-950 text-white flex flex-col sm:flex-row items-center gap-4 border-t border-zinc-900">
                    
                    {/* Play/Pause */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-850 flex items-center justify-center text-white border border-zinc-800 cursor-pointer transition-colors"
                        title={isPlaying ? 'Pausar' : 'Reproduzir'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </button>
                      
                      {/* Video speed */}
                      <button
                        onClick={() => {
                          const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
                          const currentIdx = speeds.indexOf(videoSpeed);
                          const nextIdx = (currentIdx + 1) % speeds.length;
                          setVideoSpeed(speeds[nextIdx]);
                        }}
                        className="text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 px-2.5 py-2 rounded-lg hover:bg-zinc-850 cursor-pointer text-cyan-400"
                        title="Mudar Velocidade de Reprodução"
                      >
                        {videoSpeed}
                      </button>
                    </div>

                    {/* Timeline Seekbar progress */}
                    <div className="flex-1 w-full flex items-center gap-3">
                      <span className="text-[10px] text-zinc-400 font-mono">00:00</span>
                      <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = ((e.clientX - rect.left) / rect.width) * 100;
                        setVideoProgress(Math.round(percent));
                      }}>
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300" 
                          style={{ width: `${videoProgress}%` }} 
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">15:00</span>
                    </div>

                    {/* Completion checkbox check */}
                    <button
                      onClick={() => selectedProduct && toggleLessonCompletion(selectedProduct.id, activeLesson.id)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                        activeLesson.completed 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-850'
                      }`}
                    >
                      {activeLesson.completed ? (
                        <>
                          <Check className="w-4 h-4" /> Aula Concluída
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-zinc-650" /> Marcar Conclusão
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Lesson Details and Forum Tabs navigation */}
                <div className="space-y-4">
                  <div className="flex gap-2 border-b border-gray-150 dark:border-zinc-900 pb-1.5 font-semibold text-xs overflow-x-auto shrink-0">
                    {[
                      { id: 'details', label: 'Material PDF & Apoio', icon: <Download className="w-3.5 h-3.5" /> },
                      { id: 'comments', label: 'Fórum & Dúvidas (Tutor AI)', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                      { id: 'quiz', label: 'Quiz de Teste Conhecimento', icon: <BookOpen className="w-3.5 h-3.5" /> },
                      { id: 'certificate', label: 'Gerar Certificado de Conclusão', icon: <Award className="w-3.5 h-3.5" /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-2 border-b-2 rounded-t-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400 font-bold'
                            : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab contents execution */}
                  <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md min-h-[220px]">
                    
                    {/* DETAILS AND DOWNLOAD ATTACHMENTS */}
                    {activeTab === 'details' && (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-base">{activeLesson.title}</h3>
                          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">{activeLesson.description}</p>
                        </div>

                        {/* Download components */}
                        <div className="space-y-2 pt-3 border-t border-gray-150 dark:border-zinc-900">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Arquivos e Anexos de Apoio</p>
                          {activeLesson.materials.length === 0 ? (
                            <p className="text-[11px] text-zinc-400 italic">Nenhum material de apoio anexado por este produtor nesta aula específica.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {activeLesson.materials.map((m, idx) => (
                                <a
                                  key={idx}
                                  href={m.url}
                                  onClick={(e) => { e.preventDefault(); alert(`Download simulado do arquivo: "${m.name}".`); }}
                                  className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-blue-500 bg-zinc-50 dark:bg-zinc-900/40 text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center justify-between group transition-all"
                                >
                                  <span className="truncate flex items-center gap-1.5 leading-none">
                                    <Download className="w-4 h-4 text-blue-500 shrink-0" />
                                    {m.name}
                                  </span>
                                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-mono uppercase">Baixar</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interactive stars feedback critis */}
                        <div className="space-y-3 pt-4 border-t border-gray-150 dark:border-zinc-900">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Avaliar Aula ou Experiência</p>
                          {hasRated ? (
                            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center gap-1.5 text-xs font-semibold border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4" /> Sua avaliação de {studentRating} estrelas foi salva no banco local!
                            </div>
                          ) : (
                            <form onSubmit={handleRatingSubmit} className="flex flex-wrap items-center gap-4">
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setStudentRating(star)}
                                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                                  >
                                    <Star className={`w-5 h-5 ${studentRating >= star ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
                                  </button>
                                ))}
                              </div>
                              <button
                                type="submit"
                                className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold px-3 py-1.5 rounded-lg text-[10px] hover:opacity-90 flex items-center gap-1 cursor-pointer"
                              >
                                Enviar Feedback de Nota
                              </button>
                            </form>
                          )}
                        </div>

                      </div>
                    )}

                    {/* COMMENTS AND AI SUPPORT SYSTEM */}
                    {activeTab === 'comments' && (
                      <div className="space-y-5">
                        <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
                          {classroomComments.map((com, idx) => (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-xl text-xs space-y-1.5 border transition-all ${
                                com.isInstructor 
                                  ? 'bg-blue-50/95 border-blue-300 text-gray-950 dark:bg-[#15233a]/90 dark:border-cyan-500/55 dark:text-white shadow-md' 
                                  : 'bg-zinc-50 border-gray-150 dark:bg-zinc-900/40 dark:border-zinc-850 text-slate-700 dark:text-zinc-350'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-bold flex items-center gap-1.5 ${com.isInstructor ? 'text-blue-700 dark:text-cyan-400' : ''}`}>
                                  {com.isInstructor && <Sparkles className="w-4.5 h-4.5 text-blue-600 dark:text-cyan-400 fill-blue-600/20 dark:fill-cyan-400/20 animate-pulse" />}
                                  {com.name}
                                  {com.isInstructor && (
                                    <span className="bg-blue-600 dark:bg-cyan-500 text-white dark:text-black font-mono text-[8.5px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest leading-none">
                                      TUTOR IA
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">{com.date}</span>
                              </div>
                              <p className={`leading-relaxed ${com.isInstructor ? 'text-gray-950 dark:text-slate-50 font-semibold text-xs md:text-[13px]' : 'text-slate-800 dark:text-zinc-300'}`}>
                                {com.text}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Reply box */}
                        <form onSubmit={handlePostComment} className="flex gap-2 border-t border-gray-150 dark:border-zinc-900 pt-3">
                          <input
                            type="text"
                            required
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            placeholder="Tire sua dúvida técnica ou peça apoio..."
                            className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 dark:text-white"
                          />
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                          >
                            Enviar Pergunta
                          </button>
                        </form>
                      </div>
                    )}

                    {/* EXAM QUIZ */}
                    {activeTab === 'quiz' && (
                      <div className="space-y-5">
                        {!selectedProduct.quiz || selectedProduct.quiz.length === 0 ? (
                          <div className="text-center py-6 text-xs text-zinc-400">
                            Nenhum questionário avaliativo disponível para este curso digital no momento.
                          </div>
                        ) : quizSubmitted ? (
                          <div className="space-y-4 text-center max-w-sm mx-auto py-4">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 text-lg font-black">
                              {quizScore}/{selectedProduct.quiz.length}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-gray-950 dark:text-white">Resultado do Quiz enviado!</h4>
                              <p className="text-xs text-gray-500 dark:text-zinc-400">
                                Você acertou {quizScore} de {selectedProduct.quiz.length} questões. 
                                {quizScore === selectedProduct.quiz.length 
                                  ? ' Excelente desempenho, conhecimento consolidado!' 
                                  : ' Experimente revisar as aulas teóricas para garantir nota máxima!'}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedAnswers({});
                                setQuizSubmitted(false);
                                setQuizScore(0);
                              }}
                              className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-gray-700 dark:text-zinc-300 text-[10px] font-semibold px-4 py-2 rounded-lg cursor-pointer"
                            >
                              Tentar Novamente
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleQuizSubmit} className="space-y-5">
                            {selectedProduct.quiz.map((q, idx) => (
                              <div key={q.id} className="space-y-3">
                                <p className="text-xs font-bold text-gray-900 dark:text-white flex gap-1.5 leading-snug">
                                  <span>{idx + 1}.</span>
                                  <span>{q.question}</span>
                                </p>
                                <div className="space-y-2">
                                  {q.options.map((opt, optIdx) => (
                                    <label
                                      key={optIdx}
                                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-colors block ${
                                        selectedAnswers[q.id] === optIdx
                                          ? 'border-blue-500 bg-blue-50/25 dark:bg-blue-950/20'
                                          : 'border-zinc-150 dark:border-zinc-900 hover:bg-zinc-100/50'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`quiz_${q.id}`}
                                        checked={selectedAnswers[q.id] === optIdx}
                                        onChange={() => handleQuizAnswer(q.id, optIdx)}
                                        className="mt-0.5 text-blue-600 border-zinc-200 focus:ring-blue-500"
                                      />
                                      <span className="text-gray-750 dark:text-zinc-400">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <button
                              type="submit"
                              disabled={Object.keys(selectedAnswers).length < selectedProduct.quiz.length}
                              className="bg-blue-600 hover:bg-blue-500 disabled:bg-indigo-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                            >
                              Enviar Respostas
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* DIGITAL CERTIFICATE CABINET */}
                    {activeTab === 'certificate' && selectedProduct && calculateCompletion(selectedProduct) < 100 && (
                      <div className="space-y-6 max-w-xl mx-auto py-4 animate-in fade-in">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
                            <Award className="w-8 h-8 text-amber-500 animate-pulse" />
                          </div>
                          <h3 className="font-extrabold text-gray-955 dark:text-white text-base">Diploma Temporariamente Bloqueado</h3>
                          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                            Você concluiu <strong className="text-amber-500">{calculateCompletion(selectedProduct)}%</strong> deste treinamento. Para requisitar o seu diploma oficial registrado pela Coldmart, você precisará assistir a todas as aulas teóricas e marcá-las como concluídas.
                          </p>
                        </div>

                        {/* Progress Bar Display */}
                        <div className="space-y-1.5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-850">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-zinc-500 font-mono">PROGRESSO DE ESTUDO ATUAL</span>
                            <span className="text-amber-500 font-mono text-xs">{calculateCompletion(selectedProduct)}% / 100%</span>
                          </div>
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all duration-300" 
                              style={{ width: `${calculateCompletion(selectedProduct)}%` }}
                            />
                          </div>
                        </div>

                        {/* reviewer simulated cheat bypass */}
                        <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-2 text-center mt-3 shadow-sm">
                          <p className="text-[10px] text-purple-605 dark:text-purple-400 font-extrabold uppercase tracking-wide">🔬 Depurador Coldmart (Testar Ferramenta)</p>
                          <p className="text-[11px] text-zinc-505 dark:text-zinc-400 leading-relaxed font-sans">
                            Quer testar e simular a emissão do PDF impresso agora mesmo sem ter que assistir todas as aulas? Clique no botão abaixo para concluir todos os módulos de forma automática neste simulador:
                          </p>
                          <button
                            type="button"
                            onClick={handleForceCompleteCourse}
                            className="bg-purple-655 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Simular Conclusão do Curso Instantaneamente
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'certificate' && selectedProduct && calculateCompletion(selectedProduct) >= 100 && (
                      <div className="space-y-6 animate-in fade-in">
                          <div className="space-y-2 text-center max-w-md mx-auto">
                            <Award className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                            <h3 className="font-extrabold text-gray-955 dark:text-white text-base font-display">Parabéns! Reivindique Seu Certificado</h3>
                            <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                              O sistema da Coldmart validou suas etapas curriculares. Personalize o nome do formando abaixo e emita o diploma:
                            </p>
                          </div>

                          {/* Name customizer */}
                          <div className="max-w-md mx-auto">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-mono text-center">NOME COMPLETO DO GRADUANDO NO DIPLOMA</label>
                            <input
                              type="text"
                              value={certStudentName}
                              onChange={(e) => setCertStudentName(e.target.value)}
                              placeholder="Digite o nome para o diploma"
                              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-805 rounded-xl px-4 py-2.5 text-xs text-center font-bold focus:outline-none focus:border-amber-500 dark:text-white uppercase mb-4"
                            />
                          </div>

                        {/* Interactive Gold Certificate mock block */}
                        <div className="border border-amber-500/25 p-2 bg-amber-500/[0.01] rounded-2xl max-w-2xl mx-auto">
                          <div id="print_section" className="border-4 border-double border-amber-500 rounded-xl bg-white text-zinc-900 p-8 flex flex-col justify-between aspect-[1.414/1] text-center space-y-4 shadow-xl">
                            
                            {/* Logo inside */}
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-bold tracking-widest text-zinc-400 font-mono">HASH: CM_VALIDATOR_{selectedProduct?.id}</span>
                              <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-white text-[10px]">CM</div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] font-black tracking-[0.25em] uppercase text-amber-600 block">DIPLOMA OFICIAL DE CONCLUSÃO CORRESPONDENTE</span>
                              <h4 className="font-serif font-extrabold text-2xl italic text-gray-900 leading-tight uppercase">{certStudentName || currentUser.name}</h4>
                              <p className="text-[11.5px] text-zinc-650 leading-relaxed max-w-sm mx-auto font-sans">
                                Certificamos para todos os fins acadêmicos e mercadológicos que o aluno portador deste documento concluiu com excelência 100% das etapas do treinamento digital de <strong>{selectedProduct?.title}</strong>, ministrado pelo docente <strong>{selectedProduct?.creatorName}</strong>.
                              </p>
                            </div>

                            <div className="flex justify-between items-end pt-4 text-[9px] font-mono text-zinc-400">
                              <div className="text-left w-2/5 border-t border-zinc-200 pt-1">
                                <p className="font-semibold text-zinc-750">DIRETORIA ACADÊMICA</p>
                                <p>Antigravity Compliance Coldmart</p>
                              </div>
                              <div className="flex flex-col items-center w-1/5 shrink-0">
                                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-bold font-serif text-[10px]">SOLO</div>
                                <span className="mt-1 font-mono text-[7px] truncate uppercase">ID: CM-{selectedProduct?.id.substring(0, 4)}</span>
                              </div>
                              <div className="text-right w-2/5 border-t border-zinc-200 pt-1">
                                <p className="font-semibold text-zinc-750">DATA DE CONCLUSÃO</p>
                                <p>{new Date().toLocaleDateString('pt-BR')}</p>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={handlePrintCertificate}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer active:scale-[0.98] transition-all"
                          >
                            <Printer className="w-4 h-4" />
                            Imprimir ou Emitir PDF Oficial
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            ) : (
              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 py-12">Nenhuma aula ativada. Inicie uma selecionando o curso e um módulo correspondente na lista lateral!</p>
            )}
          </main>

        </div>
      </div>
    )}

    </div>
  );
};
