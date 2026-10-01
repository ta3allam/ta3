export interface AffiliateCourse {
  id: string;
  title: string;
  originalTitle: string;
  provider: 'Coursera' | 'Udemy' | 'edX' | 'DeepLearning.AI' | 'CS50' | 'Frontend Masters';
  category: 'cs' | 'ai' | 'web' | 'mobile' | 'cloud' | 'design' | 'business';
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  instructor: string;
  duration: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'كافة المستويات';
  language: string;
  hasArabicSubtitles: boolean;
  affiliateUrl: string;
  couponCode?: string;
  discountPercentage?: number;
  originalPriceUSD?: number;
  discountedPriceUSD?: number;
  isFree?: boolean;
  certificateIncluded: boolean;
  description: string;
  keySkills: string[];
  badge?: string;
}

export const AFFILIATE_COURSES: AffiliateCourse[] = [
  {
    id: 'aff-cs50-x',
    title: 'مقدمة هارفارد في علوم الحاسوب (CS50x)',
    originalTitle: 'CS50x: Introduction to Computer Science',
    provider: 'CS50',
    category: 'cs',
    categoryLabel: 'علوم الحاسوب والأساسيات',
    rating: 4.9,
    reviewCount: 24500,
    instructor: 'David J. Malan (جامعة هارفارد)',
    duration: '12 أسبوعاً (ذاتي التعلم)',
    level: 'كافة المستويات',
    language: 'الإنجليزية',
    hasArabicSubtitles: true,
    affiliateUrl: 'https://cs50.harvard.edu/x/?ref=ta3allam',
    isFree: true,
    certificateIncluded: true,
    description: 'أقوى كورس تأسيسي في علوم الحاسوب والبرمجة عالمياً من جامعة هارفارد. يغطي C، بايثون، SQL، الخوارزميات وهياكل البيانات.',
    keySkills: ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures', 'Memory Management'],
    badge: 'الأعلى تقييماً عالمياً 🌟'
  },
  {
    id: 'aff-dl-specialization',
    title: 'تخصص التعلّم العميق والشبكات العصبية (Deep Learning)',
    originalTitle: 'Deep Learning Specialization',
    provider: 'DeepLearning.AI',
    category: 'ai',
    categoryLabel: 'الذكاء الاصطناعي وتعلم الآلة',
    rating: 4.9,
    reviewCount: 18900,
    instructor: 'Andrew Ng (ستانفورد & DeepLearning.AI)',
    duration: '3 أشهر (5 ساعات أسبوعياً)',
    level: 'متوسط',
    language: 'الإنجليزية',
    hasArabicSubtitles: true,
    affiliateUrl: 'https://www.coursera.org/specializations/deep-learning?ranMID=40328&ranEAID=ta3allam',
    couponCode: 'TA3DEEP20',
    discountPercentage: 20,
    originalPriceUSD: 49,
    discountedPriceUSD: 39,
    isFree: false,
    certificateIncluded: true,
    description: 'التخصص المعياري لمهندسي الذكاء الاصطناعي بإشراف البروفيسور أندرو نغ. بناء الشبكات العصبية العميقة، CNN، RNN، Transformers من الصفر.',
    keySkills: ['Neural Networks', 'CNN', 'RNN', 'Transformers', 'TensorFlow', 'PyTorch'],
    badge: 'معتمد من DeepLearning.AI 🧠'
  },
  {
    id: 'aff-meta-frontend',
    title: 'شهادة ميتا الاحترافية لمطور واجهات الويب (Meta Front-End)',
    originalTitle: 'Meta Front-End Developer Professional Certificate',
    provider: 'Coursera',
    category: 'web',
    categoryLabel: 'تطوير الويب الشامل',
    rating: 4.8,
    reviewCount: 14200,
    instructor: 'فريق مهندسي Meta',
    duration: '5 أشهر (6 ساعات أسبوعياً)',
    level: 'مبتدئ',
    language: 'الإنجليزية',
    hasArabicSubtitles: true,
    affiliateUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer?ranMID=40328&ranEAID=ta3allam',
    couponCode: 'META-TA3-PROMO',
    discountPercentage: 25,
    originalPriceUSD: 49,
    discountedPriceUSD: 36,
    isFree: false,
    certificateIncluded: true,
    description: 'برنامج تدريبي متكامل من شركة Meta يؤهلك لسوق العمل العالمي كمطور React و JavaScript محترف مع مشاريع حقيقية جاهزة لمحفظة الأعمال.',
    keySkills: ['React.js', 'JavaScript ES6+', 'HTML5/CSS3', 'UI/UX', 'Jest & RTL Testing', 'Git & CI/CD'],
    badge: 'شهادة مهنية من Meta 💼'
  },
  {
    id: 'aff-udemy-angela-bootcamp',
    title: 'المعسكر الشامل لتطوير الويب 2026: من الصفر حتى الاحتراف',
    originalTitle: 'The Complete Full-Stack Web Development Bootcamp',
    provider: 'Udemy',
    category: 'web',
    categoryLabel: 'تطوير الويب الشامل',
    rating: 4.8,
    reviewCount: 312000,
    instructor: 'Dr. Angela Yu (London App Brewery)',
    duration: '65 ساعة فيديو عند الطلب',
    level: 'كافة المستويات',
    language: 'الإنجليزية',
    hasArabicSubtitles: true,
    affiliateUrl: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=TA3ALLAM_MEGA',
    couponCode: 'TA3ALLAM_MEGA',
    discountPercentage: 85,
    originalPriceUSD: 84.99,
    discountedPriceUSD: 12.99,
    isFree: false,
    certificateIncluded: true,
    description: 'أشهر معسكر برمجي على يوديمي. يغطي HTML, CSS, JS, Node.js, Express, React, PostgreSQL, REST APIs, ونشر التطبيقات السحابية.',
    keySkills: ['Full-Stack', 'Node.js', 'PostgreSQL', 'Express', 'React', 'REST APIs'],
    badge: 'الأكثر مبيعاً عالمياً 🔥'
  },
  {
    id: 'aff-fm-react-deepdive',
    title: 'احتراف هندسة بنية React المتقدمة وإدارة الأداء',
    originalTitle: 'Advanced React Patterns and Performance',
    provider: 'Frontend Masters',
    category: 'web',
    categoryLabel: 'تطوير الويب الشامل',
    rating: 4.9,
    reviewCount: 8600,
    instructor: 'Kent C. Dodds',
    duration: '8 ساعات تقنية مكثفة',
    level: 'متقدم',
    language: 'الإنجليزية',
    hasArabicSubtitles: false,
    affiliateUrl: 'https://frontendmasters.com/courses/advanced-react-patterns/?ref=ta3allam',
    couponCode: 'FMTA3DEV',
    discountPercentage: 15,
    originalPriceUSD: 39,
    discountedPriceUSD: 33,
    isFree: false,
    certificateIncluded: true,
    description: 'دورة المستوى الرفيع لكبار مهندسي الواجهات. أنماط التصميم المتقدمة، تحسين سرعة العرض (Zero-Jank)، وهندسة الخطافات المخصصة.',
    keySkills: ['Advanced Hooks', 'State Reducers', 'Compound Components', 'Profiler Optimization'],
    badge: 'للمطورين المحترفين ⚡'
  },
  {
    id: 'aff-google-data-analytics',
    title: 'شهادة جوجل الاحترافية في تحليل البيانات (Google Data Analytics)',
    originalTitle: 'Google Data Analytics Professional Certificate',
    provider: 'Coursera',
    category: 'ai',
    categoryLabel: 'الذكاء الاصطناعي وتعلم الآلة',
    rating: 4.8,
    reviewCount: 95000,
    instructor: 'فريق خبراء تحليل البيانات في Google',
    duration: '6 أشهر (5 ساعات أسبوعياً)',
    level: 'مبتدئ',
    language: 'الإنجليزية',
    hasArabicSubtitles: true,
    affiliateUrl: 'https://www.coursera.org/professional-certificates/google-data-analytics?ranMID=40328&ranEAID=ta3allam',
    couponCode: 'GOOGLE-TA3-CERT',
    discountPercentage: 20,
    originalPriceUSD: 49,
    discountedPriceUSD: 39,
    isFree: false,
    certificateIncluded: true,
    description: 'احصل على اعتماد مباشر من شركة Google في تحليل البيانات الضخمة، لوحات البيانات التفاعلية Tableau، لغة R، ولغة SQL.',
    keySkills: ['SQL', 'Tableau', 'R Programming', 'Data Cleaning', 'Spreadsheets', 'Data Visualization'],
    badge: 'شهادة مهنية من Google 📊'
  },
  {
    id: 'aff-udemy-flutter-dart',
    title: 'دورة تطوير تطبيقات الموبايل الشاملة باستخدام Flutter & Dart',
    originalTitle: 'Flutter & Dart - The Complete Guide [2026 Edition]',
    provider: 'Udemy',
    category: 'mobile',
    categoryLabel: 'تطبيقات الهواتف الذكية',
    rating: 4.7,
    reviewCount: 78000,
    instructor: 'Maximilian Schwarzmüller (Academind)',
    duration: '42 ساعة تدريبية',
    level: 'كافة المستويات',
    language: 'الإنجليزية',
    hasArabicSubtitles: true,
    affiliateUrl: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-and-android-apps/?couponCode=TA3_FLUTTER',
    couponCode: 'TA3_FLUTTER',
    discountPercentage: 80,
    originalPriceUSD: 74.99,
    discountedPriceUSD: 14.99,
    isFree: false,
    certificateIncluded: true,
    description: 'بناء وتصدير تطبيقات أندرويد و iOS من قاعدة كود واحدة باستخدام فلاتر. إدارة الحالة عبر Bloc و Riverpod، وربط الخدمات الخلفية.',
    keySkills: ['Flutter', 'Dart', 'iOS & Android', 'State Management', 'REST APIs', 'Firebase'],
    badge: 'تطبيقات Cross-Platform 📱'
  },
  {
    id: 'aff-aws-cloud-practitioner',
    title: 'الإعداد الشامل لشهادة مهندس الحوسبة السحابية AWS Certified',
    originalTitle: 'Ultimate AWS Certified Solutions Architect Associate',
    provider: 'Udemy',
    category: 'cloud',
    categoryLabel: 'الحوسبة السحابية وDevOps',
    rating: 4.9,
    reviewCount: 160000,
    instructor: 'Stéphane Maarek (AWS Hero)',
    duration: '28 ساعة تفصيلية مع اختبارات تجريبية',
    level: 'متوسط',
    language: 'الإنجليزية',
    hasArabicSubtitles: true,
    affiliateUrl: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/?couponCode=TA3_AWS',
    couponCode: 'TA3_AWS',
    discountPercentage: 82,
    originalPriceUSD: 84.99,
    discountedPriceUSD: 14.99,
    isFree: false,
    certificateIncluded: true,
    description: 'الدورة الأولى عالمياً لاجتياز اختبار شهادة AWS SAA-C03. تغطي EC2, S3, RDS, Lambda, VPC, IAM, ومبادئ البنية التحتية المقاومة للأعطال.',
    keySkills: ['AWS', 'Cloud Architecture', 'Serverless', 'DevOps', 'Security & IAM', 'Docker'],
    badge: 'إعداد شهادة دولية ☁️'
  }
];
