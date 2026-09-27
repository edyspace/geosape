import {
  AppState,
  ClassRoom,
  Student,
  MaterialItem,
  Assignment,
  Submission,
  AppreciationRecord,
  QuizTournament,
  BankQuestion
} from '../types';

const STORAGE_KEY = 'gurukelas_app_state_v1';

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'cls-xi-ips-1',
    name: 'XI IPS 1',
    grade: 'XI',
    inviteCode: 'GEO-XI-1',
    color: '#059669', // emerald
    description: 'Kelas Peminatan Geografi Lab Lantai 2 R.201 - Jadwal: Senin & Rabu',
    academicYear: '2024/2025',
  },
  {
    id: 'cls-xi-ips-2',
    name: 'XI IPS 2',
    grade: 'XI',
    inviteCode: 'GEO-XI-2',
    color: '#0284c7', // sky
    description: 'Kelas Unggulan Sosial R.202 - Jadwal: Selasa & Kamis',
    academicYear: '2024/2025',
  },
  {
    id: 'cls-xii-ips-1',
    name: 'XII IPS 1',
    grade: 'XII',
    inviteCode: 'GEO-XII-1',
    color: '#6366f1', // indigo
    description: 'Persiapan SNBT & Ujian Sekolah R.301 - Jadwal: Selasa & Jumat',
    academicYear: '2024/2025',
  },
  {
    id: 'cls-xii-ips-2',
    name: 'XII IPS 2',
    grade: 'XII',
    inviteCode: 'GEO-XII-2',
    color: '#d97706', // amber
    description: 'Persiapan SNBT R.302 - Jadwal: Rabu & Jumat',
    academicYear: '2024/2025',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // XI IPS 1
  { id: 'std-1', classId: 'cls-xi-ips-1', name: 'Ahmad Fauzan', nisn: '007123401', gender: 'L', points: 45, badges: ['Bintang Keaktifan', 'Geograf Muda'] },
  { id: 'std-2', classId: 'cls-xi-ips-1', name: 'Bunga Citra Lestari', nisn: '007123402', gender: 'P', points: 60, badges: ['Juara Kuis', 'Ahli Kartografi'] },
  { id: 'std-3', classId: 'cls-xi-ips-1', name: 'Dimas Satria', nisn: '007123403', gender: 'L', points: 30, badges: ['Turnamen'] },
  { id: 'std-4', classId: 'cls-xi-ips-1', name: 'Farah Salsabila', nisn: '007123404', gender: 'P', points: 55, badges: ['Rajin Mengumpul', 'Master SIG'] },
  { id: 'std-5', classId: 'cls-xi-ips-1', name: 'Gilang Ramadhan', nisn: '007123405', gender: 'L', points: 40, badges: ['Bintang Keaktifan'] },
  
  // XI IPS 2
  { id: 'std-6', classId: 'cls-xi-ips-2', name: 'Aditya Pratama', nisn: '007123406', gender: 'L', points: 50, badges: ['Geograf Muda', 'Penjelajah Bumi'] },
  { id: 'std-7', classId: 'cls-xi-ips-2', name: 'Cantika Putri', nisn: '007123407', gender: 'P', points: 70, badges: ['Bintang Keaktifan', 'Master SIG', 'Juara Kuis'] },
  { id: 'std-8', classId: 'cls-xi-ips-2', name: 'Daffa Rizky', nisn: '007123408', gender: 'L', points: 35, badges: ['Turnamen'] },
  { id: 'std-9', classId: 'cls-xi-ips-2', name: 'Eka Nurhaliza', nisn: '007123409', gender: 'P', points: 45, badges: ['Rajin Mengumpul'] },
  { id: 'std-10', classId: 'cls-xi-ips-2', name: 'Fikri Haikal', nisn: '007123410', gender: 'L', points: 55, badges: ['Ahli Kartografi'] },

  // XII IPS 1
  { id: 'std-11', classId: 'cls-xii-ips-1', name: 'Ilham Kusuma', nisn: '006123411', gender: 'L', points: 80, badges: ['SNBT Master', 'Bintang Keaktifan'] },
  { id: 'std-12', classId: 'cls-xii-ips-1', name: 'Jessica Aurelia', nisn: '006123412', gender: 'P', points: 90, badges: ['Top Scorer', 'Master SIG', 'Juara Kuis'] },
  { id: 'std-13', classId: 'cls-xii-ips-1', name: 'Muhammad Rayhan', nisn: '006123413', gender: 'L', points: 65, badges: ['Geograf Muda'] },
  { id: 'std-14', classId: 'cls-xii-ips-1', name: 'Nabila Syakieb', nisn: '006123414', gender: 'P', points: 75, badges: ['Rajin Mengumpul', 'Ahli Kartografi'] },

  // XII IPS 2
  { id: 'std-15', classId: 'cls-xii-ips-2', name: 'Kevin Sanjaya', nisn: '006123415', gender: 'L', points: 60, badges: ['Bintang Keaktifan'] },
  { id: 'std-16', classId: 'cls-xii-ips-2', name: 'Larasati Dewi', nisn: '006123416', gender: 'P', points: 85, badges: ['Penjelajah Bumi', 'Top Scorer'] },
  { id: 'std-17', classId: 'cls-xii-ips-2', name: 'Reza Rahardian', nisn: '006123417', gender: 'L', points: 50, badges: ['Turnamen'] },
];

export const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-1',
    title: 'Dinamika Litosfer dan Pengaruhnya terhadap Kehidupan',
    chapter: 'Bab 1: Dinamika Litosfer',
    targetClassIds: ['cls-xi-ips-1', 'cls-xi-ips-2'],
    type: 'document',
    content: `# Dinamika Litosfer dan Bentuk Muka Bumi

Litosfer adalah lapisan batuan pembentuk kulit bumi (kerak benua dan kerak samudra).

## 1. Tenaga Endogen (Pembentuk Relief Bumi dari Dalam)
- **Tektonisme**: Pergerakan lempeng tektonik (Epirogenesa dan Orogenesa - lipatan & patahan).
- **Vulkanisme**: Peristiwa naiknya magma dari litosfer ke permukaan bumi (intrusi dan ekstrusi magma).
- **Seisme (Gempa Bumi)**: Getaran kerak bumi akibat pelepasan energi gelombang seismik (P-wave dan S-wave).

## 2. Tenaga Eksogen (Perombak Relief Bumi dari Luar)
- Pelapukan (Mekanik, Kimiawi, Organik)
- Erosi dan Sedimentasi (Fluvial, Aeolian, Marin, Glasial)

> **Catatan Ujian Geografi:** Indonesia berada di pertemuan 3 lempeng tektonik aktif dunia: Lempeng Indo-Australia, Eurasia, dan Pasifik.`,
    url: 'https://earthquake.usgs.gov/earthquakes/map/',
    publishDate: '2024-08-10',
    completedByStudentIds: ['std-1', 'std-2', 'std-6', 'std-7'],
    createdAt: '2024-08-10T08:00:00.000Z',
  },
  {
    id: 'mat-2',
    title: 'Dinamika Atmosfer: Klasifikasi Iklim Koppen & Iklim Junghuhn',
    chapter: 'Bab 2: Dinamika Atmosfer',
    targetClassIds: ['all'],
    type: 'video',
    content: `Video pembelajaran komprehensif mengenai lapisan atmosfer dan klasifikasi iklim:
1. Lapisan Atmosfer: Troposfer, Stratosfer (lapisan ozon), Mesosfer (pembakar meteor), Termosfer (ionosfer gelombang radio), Eksosfer.
2. Iklim Junghuhn berdasarkan ketinggian dan vegetasi:
   - Zona Panas (0 - 600m): Padi, tebu, kelapa.
   - Zona Sedang (600 - 1500m): Teh, kopi, karet, kina.
   - Zona Sejuk (1500 - 2500m): Sayuran, pinus, cemara.
   - Zona Dingin (> 2500m): Lumut.
3. Fenomena Cuaca Ekstrem: El Nino (kemarau berkepanjangan) dan La Nina (curah hujan tinggi).`,
    url: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds',
    publishDate: '2024-08-18',
    completedByStudentIds: ['std-1', 'std-7', 'std-11', 'std-12'],
    createdAt: '2024-08-18T09:30:00.000Z',
  },
  {
    id: 'mat-3',
    title: 'Penginderaan Jauh & Sistem Informasi Geografis (SIG)',
    chapter: 'Bab 3: SIG dan Penginderaan Jauh',
    targetClassIds: ['cls-xii-ips-1', 'cls-xii-ips-2'],
    type: 'pdf',
    content: `Modul materi SNBT Geografi:
- Unsur-unsur interpretasi citra: Rona/Warna, Bentuk, Ukuran, Tekstur, Pola, Bayangan, Situs, dan Asosiasi.
- Subsistem SIG: Input data (spasial vektor/raster), Manajemen data, Manipulasi & Analisis (Overlay/Buffering), dan Output (Peta tematik).`,
    url: 'https://example.com/modul-sig-geografi.pdf',
    publishDate: '2024-08-25',
    completedByStudentIds: ['std-11', 'std-12', 'std-15', 'std-16'],
    createdAt: '2024-08-25T10:00:00.000Z',
  }
];

export const INITIAL_BANK_QUESTIONS: BankQuestion[] = [
  {
    id: 'bq-1',
    chapter: 'Bab 1: Dinamika Litosfer',
    question: 'Pertemuan lempeng tektonik di mana salah satu lempeng menunjam ke bawah lempeng lainnya membentuk palung laut dan deretan gunung api disebut zona...',
    difficulty: 'Sedang',
    options: ['Subduksi (Konvergen)', 'Divergen (Pemekaran)', 'Transform (Sesar Mendatar)', 'Rift Valley'],
    correctIndex: 0,
    explanation: 'Zona subduksi terjadi saat lempeng samudra menunjam ke bawah lempeng benua (batas konvergen), seperti yang terjadi di sebelah barat Sumatera dan selatan Jawa.',
    points: 100,
    createdAt: '2024-08-01T08:00:00.000Z',
  },
  {
    id: 'bq-2',
    chapter: 'Bab 1: Dinamika Litosfer',
    question: 'Bentuk intrusi magma yang membeku di antara dua lapisan batuan sedimen dan berbentuk cembung ke atas serta alasnya datar disebut...',
    difficulty: 'Mudah',
    options: ['Batolit', 'Lakolit', 'Sill', 'Diatrema'],
    correctIndex: 1,
    explanation: 'Lakolit adalah intrusi magma berbentuk lensa cembung ke atas dengan alas datar di antara dua perlapisan batuan.',
    points: 100,
    createdAt: '2024-08-01T08:10:00.000Z',
  },
  {
    id: 'bq-3',
    chapter: 'Bab 2: Dinamika Atmosfer',
    question: 'Menurut klasifikasi iklim Junghuhn, wilayah dengan ketinggian 700 - 1.200 meter di atas permukaan laut sangat cocok untuk budidaya perkebunan...',
    difficulty: 'Mudah',
    options: ['Padi dan Kelapa', 'Teh, Kopi, dan Kina', 'Lumut dan Hutan Tundra', 'Karet dan Tembakau Dataran Rendah'],
    correctIndex: 1,
    explanation: 'Ketinggian 600 - 1.500 m dpl termasuk Zona Sedang menurut Junghuhn, yang paling optimal untuk tanaman teh, kopi, kina, dan cokelat.',
    points: 100,
    createdAt: '2024-08-02T09:00:00.000Z',
  },
  {
    id: 'bq-4',
    chapter: 'Bab 2: Dinamika Atmosfer',
    question: 'Fenomena pemanasan suhu permukaan laut di Samudra Pasifik bagian tengah hingga timur yang menyebabkan musim kemarau panjang di Indonesia disebut...',
    difficulty: 'Sedang',
    options: ['La Nina', 'El Nino', 'Dipole Mode Negatif', 'Monsun Barat'],
    correctIndex: 1,
    explanation: 'El Nino menyebabkan massa udara basah bergeser ke Pasifik timur, sehingga wilayah Indonesia mengalami penurunan curah hujan drastis dan kekeringan.',
    points: 100,
    createdAt: '2024-08-02T09:30:00.000Z',
  },
  {
    id: 'bq-5',
    chapter: 'Bab 3: SIG dan Penginderaan Jauh',
    question: 'Dalam interpretasi citra penginderaan jauh, tajuk pohon kelapa sawit yang tampak berbentuk bintang dengan pola teratur merupakan unsur interpretasi...',
    difficulty: 'HOTS',
    options: ['Bentuk dan Pola', 'Rona dan Bayangan', 'Ukuran dan Tekstur', 'Situs dan Asosiasi'],
    correctIndex: 0,
    explanation: 'Bentuk tajuk menyerupai bintang dan susunan penanaman yang berjarak rapi teratur merupakan kombinasi unsur bentuk (shape) dan pola (pattern).',
    points: 100,
    createdAt: '2024-08-03T10:00:00.000Z',
  },
  {
    id: 'bq-6',
    chapter: 'Bab 3: SIG dan Penginderaan Jauh',
    question: 'Operasi analisis spasial dalam Sistem Informasi Geografis (SIG) yang menggabungkan beberapa lapisan (layer) peta tematik untuk menentukan kesesuaian lahan disebut...',
    difficulty: 'Sedang',
    options: ['Buffering', 'Overlay (Tumpang Susun)', 'Network Analysis', '3D Surface Rendering'],
    correctIndex: 1,
    explanation: 'Analisis Overlay mengintegrasikan beberapa layer tematik (misal kemiringan lereng, jenis tanah, curah hujan) untuk menghasilkan unit analisis baru.',
    points: 100,
    createdAt: '2024-08-03T10:30:00.000Z',
  },
  {
    id: 'bq-7',
    chapter: 'Bab 4: Mitigasi Bencana Alam',
    question: 'Wilayah Indonesia rawan terhadap gempa bumi dan tsunami karena terletak di lintasan batas lempeng tektonik yang dikenal dengan istilah...',
    difficulty: 'Mudah',
    options: ['Sirkum Atlantik', 'Ring of Fire (Cincin Api Pasifik)', 'Mid-Atlantic Ridge', 'Great Rift Valley'],
    correctIndex: 1,
    explanation: 'Indonesia dilewati oleh Ring of Fire yang merupakan jalur sabuk gempa dan gunung berapi aktif di sekeliling Samudra Pasifik.',
    points: 100,
    createdAt: '2024-08-04T11:00:00.000Z',
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Latihan Mandiri 1: Interpretasi Citra Penginderaan Jauh',
    chapter: 'Bab 3: SIG dan Penginderaan Jauh',
    category: 'TUGAS',
    targetClassIds: ['cls-xi-ips-1', 'cls-xi-ips-2'],
    instructions: 'Jawab pertanyaan analisis interpretasi citra foto udara dan SIG berikut dengan cermat untuk memahami unsur bentang alam.',
    dueDate: '2024-09-30T23:59:00.000Z',
    maxScore: 100,
    allowFileUpload: true,
    questions: [
      {
        id: 'q-geo-1',
        question: 'Dalam interpretasi citra penginderaan jauh, tajuk pohon kelapa sawit yang tampak berbentuk bintang dengan pola teratur merupakan unsur interpretasi...',
        type: 'pg',
        options: ['Bentuk dan Pola', 'Rona dan Bayangan', 'Ukuran dan Tekstur', 'Situs dan Asosiasi'],
        correctOption: 0,
        points: 50,
      },
      {
        id: 'q-geo-2',
        question: 'Jelaskan perbedaan mendasar antara data spasial vektor (titik, garis, poligon) dan data spasial raster (piksel/grid) dalam SIG beserta contoh penggunaannya!',
        type: 'essay',
        points: 50,
      }
    ],
    createdAt: '2024-08-20T07:00:00.000Z',
  },
  {
    id: 'asg-2',
    title: 'Ulangan Harian 1: Dinamika Litosfer & Tenaga Endogen',
    chapter: 'Bab 1: Dinamika Litosfer',
    category: 'UH',
    targetClassIds: ['all'],
    instructions: 'Ulangan Harian Bab Litosfer. Kerjakan soal dengan mandiri dan perhatikan konsep lempeng tektonik serta vulkanisme.',
    dueDate: '2024-10-05T12:00:00.000Z',
    maxScore: 100,
    allowFileUpload: false,
    questions: [
      {
        id: 'q-geo-3',
        question: 'Pertemuan lempeng tektonik di mana salah satu lempeng menunjam ke bawah lempeng lainnya membentuk palung laut dan deretan gunung api disebut zona...',
        type: 'pg',
        options: ['Subduksi (Konvergen)', 'Divergen (Pemekaran)', 'Transform (Sesar Mendatar)', 'Rift Valley'],
        correctOption: 0,
        points: 40,
      },
      {
        id: 'q-geo-4',
        question: 'Analisis mengapa wilayah Indonesia bagian barat memiliki deretan gunung berapi aktif tipe strato, dan jelaskan mitigasi bencana erupsi gunung api bagi warga sekitar lereng!',
        type: 'essay',
        points: 60,
      }
    ],
    createdAt: '2024-08-28T07:00:00.000Z',
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 'std-1',
    classId: 'cls-xi-ips-1',
    submittedAt: '2024-08-22T14:15:00.000Z',
    answers: {
      'q-geo-1': '0',
      'q-geo-2': 'Data vektor merepresentasikan objek bumi dalam bentuk titik (lokasi pos pemadam), garis (jaringan jalan/sungai), dan poligon (luas kecamatan). Sedangkan data raster berupa matriks sel piksel yang menyimpan nilai tertentu (contoh: citra satelit Landsat dan model elevasi DEM).'
    },
    score: 95,
    feedback: 'Penjelasan vektor dan raster sangat komprehensif dan contoh penerapannya tepat!',
    gradedAt: '2024-08-23T10:00:00.000Z',
    gradedBy: 'Drs. Budi Santoso'
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-1',
    studentId: 'std-2',
    classId: 'cls-xi-ips-1',
    submittedAt: '2024-08-22T16:40:00.000Z',
    answers: {
      'q-geo-1': '0',
      'q-geo-2': 'Vektor menggunakan koordinat x dan y untuk titik garis area. Raster berupa piksel citra foto satelit.'
    },
    score: 88,
    feedback: 'Bagus! Tambahkan contoh kasus penggunaan peta tematik untuk poin maksimal.',
    gradedAt: '2024-08-23T10:05:00.000Z',
    gradedBy: 'Drs. Budi Santoso'
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-1',
    studentId: 'std-7',
    classId: 'cls-xi-ips-2',
    submittedAt: '2024-08-22T17:10:00.000Z',
    answers: {
      'q-geo-1': '0',
      'q-geo-2': 'Vektor terdiri dari titik, garis, dan poligon dengan ketelitian tinggi tanpa pecah saat dizoom. Raster berbasis resolusi piksel seperti citra NDVI kerapatan vegetasi.'
    },
    score: 98,
    feedback: 'Sempurna! Sangat paham konsep resolusi spasial dan struktur data SIG.',
    gradedAt: '2024-08-23T10:10:00.000Z',
    gradedBy: 'Drs. Budi Santoso'
  }
];

export const INITIAL_APPRECIATIONS: AppreciationRecord[] = [
  {
    id: 'app-1',
    studentId: 'std-2',
    classId: 'cls-xi-ips-1',
    points: 10,
    reason: 'Menjelaskan klasifikasi iklim Koppen (Af, Aw, Am) di depan kelas dengan sangat lancar.',
    category: 'keaktifan',
    createdAt: '2024-08-24T09:15:00.000Z'
  },
  {
    id: 'app-2',
    studentId: 'std-7',
    classId: 'cls-xi-ips-2',
    points: 15,
    reason: 'Juara 1 Turnamen Kuis Duel Geografi Litosfer Antar Kelas dengan kecepatan respons tinggi.',
    category: 'turnamen',
    createdAt: '2024-08-25T11:20:00.000Z'
  },
  {
    id: 'app-3',
    studentId: 'std-1',
    classId: 'cls-xi-ips-1',
    points: 10,
    reason: 'Mengajukan pertanyaan kritis mengenai mitigasi likuifaksi pada tanah berpasir saat gempa.',
    category: 'bertanya',
    createdAt: '2024-08-26T08:30:00.000Z'
  }
];

export const INITIAL_QUIZZES: QuizTournament[] = [
  {
    id: 'quiz-1',
    title: 'Piala Geografi: Duel Litosfer & Atmosfer',
    topic: 'Lempeng Tektonik, Vulkanisme, dan Iklim Junghuhn',
    targetClassIds: ['cls-xi-ips-1', 'cls-xi-ips-2'],
    isInterClass: true,
    timePerQuestion: 25,
    status: 'active',
    questions: [
      {
        id: 'qz-geo-q1',
        question: 'Pertemuan lempeng tektonik di mana salah satu lempeng menunjam ke bawah lempeng lainnya membentuk palung laut dan deretan gunung api disebut zona...',
        options: ['Subduksi (Konvergen)', 'Divergen (Pemekaran)', 'Transform (Sesar Mendatar)', 'Rift Valley'],
        correctIndex: 0,
        explanation: 'Zona subduksi merupakan pergerakan konvergen lempeng samudra menunjam ke lempeng benua.',
        points: 100,
      },
      {
        id: 'qz-geo-q2',
        question: 'Menurut klasifikasi iklim Junghuhn, wilayah dengan ketinggian 700 - 1.200 meter dpl paling cocok untuk budidaya...',
        options: ['Padi dan Kelapa', 'Teh, Kopi, dan Kina', 'Lumut dan Hutan Tundra', 'Karet dan Tembakau Dataran Rendah'],
        correctIndex: 1,
        explanation: 'Zona sedang (600 - 1500m) ideal untuk teh, kopi, dan kina dengan suhu sejuk 17,1°C - 22°C.',
        points: 100,
      },
      {
        id: 'qz-geo-q3',
        question: 'Fenomena pemanasan suhu permukaan laut di Samudra Pasifik timur yang menyebabkan kemarau panjang di Indonesia disebut...',
        options: ['La Nina', 'El Nino', 'Dipole Mode Negatif', 'Monsun Barat'],
        correctIndex: 1,
        explanation: 'El Nino menyebabkan kekeringan dan kemarau panjang di sebagian besar wilayah Indonesia.',
        points: 100,
      },
      {
        id: 'qz-geo-q4',
        question: 'Indonesia sering dilanda gempa bumi dan erupsi vulkanik karena berada pada jalur cincin api dunia yang disebut...',
        options: ['Sirkum Pasifik (Ring of Fire)', 'Sirkum Mediterania saja', 'Zona Mid-Oceanic', 'Patahan San Andreas'],
        correctIndex: 0,
        explanation: 'Jalur Ring of Fire mengitari cekungan Samudra Pasifik dan mencakup kepulauan Indonesia.',
        points: 100,
      }
    ],
    participants: [
      {
        studentId: 'std-2',
        studentName: 'Bunga Citra Lestari',
        classId: 'cls-xi-ips-1',
        score: 380,
        correctCount: 4,
        timeTakenTotal: 34,
        completedAt: '2024-08-25T13:00:00.000Z',
        answers: [
          { questionId: 'qz-geo-q1', selected: 0, isCorrect: true, timeSpent: 7 },
          { questionId: 'qz-geo-q2', selected: 1, isCorrect: true, timeSpent: 6 },
          { questionId: 'qz-geo-q3', selected: 1, isCorrect: true, timeSpent: 10 },
          { questionId: 'qz-geo-q4', selected: 0, isCorrect: true, timeSpent: 11 }
        ]
      },
      {
        studentId: 'std-7',
        studentName: 'Cantika Putri',
        classId: 'cls-xi-ips-2',
        score: 390,
        correctCount: 4,
        timeTakenTotal: 30,
        completedAt: '2024-08-25T13:05:00.000Z',
        answers: [
          { questionId: 'qz-geo-q1', selected: 0, isCorrect: true, timeSpent: 5 },
          { questionId: 'qz-geo-q2', selected: 1, isCorrect: true, timeSpent: 5 },
          { questionId: 'qz-geo-q3', selected: 1, isCorrect: true, timeSpent: 9 },
          { questionId: 'qz-geo-q4', selected: 0, isCorrect: true, timeSpent: 11 }
        ]
      },
      {
        studentId: 'std-1',
        studentName: 'Ahmad Fauzan',
        classId: 'cls-xi-ips-1',
        score: 290,
        correctCount: 3,
        timeTakenTotal: 42,
        completedAt: '2024-08-25T13:10:00.000Z',
        answers: [
          { questionId: 'qz-geo-q1', selected: 0, isCorrect: true, timeSpent: 9 },
          { questionId: 'qz-geo-q2', selected: 1, isCorrect: true, timeSpent: 8 },
          { questionId: 'qz-geo-q3', selected: 0, isCorrect: false, timeSpent: 13 },
          { questionId: 'qz-geo-q4', selected: 0, isCorrect: true, timeSpent: 12 }
        ]
      }
    ],
    createdAt: '2024-08-25T12:00:00.000Z',
  }
];

export const INITIAL_STATE: AppState = {
  teacher: {
    name: 'Drs. Budi Santoso, M.Pd.',
    subject: 'Geografi SMA',
    schoolName: 'SMAN 1 Nusantara',
    academicYear: '2024/2025',
    semester: 'Ganjil',
    pin: '1234',
  },
  classes: INITIAL_CLASSES,
  students: INITIAL_STUDENTS,
  materials: INITIAL_MATERIALS,
  assignments: INITIAL_ASSIGNMENTS,
  submissions: INITIAL_SUBMISSIONS,
  appreciations: INITIAL_APPRECIATIONS,
  quizzes: INITIAL_QUIZZES,
  bankQuestions: INITIAL_BANK_QUESTIONS,
  activeClassId: 'all',
  supabase: {
    url: '',
    anonKey: '',
    connected: false,
  }
};

export class StorageService {
  static loadState(): AppState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...INITIAL_STATE,
          ...parsed,
          teacher: { ...INITIAL_STATE.teacher, ...(parsed.teacher || {}) },
          supabase: { ...INITIAL_STATE.supabase, ...(parsed.supabase || {}) },
          bankQuestions: Array.isArray(parsed.bankQuestions) && parsed.bankQuestions.length > 0
            ? parsed.bankQuestions
            : INITIAL_BANK_QUESTIONS,
        };
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
    return INITIAL_STATE;
  }

  static saveState(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  static exportBackup(state: AppState): void {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GuruKelas_Geografi_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  static resetToDefault(): AppState {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_STATE;
  }

  static clearDatabase(): AppState {
    const emptyState: AppState = {
      teacher: {
        name: 'Guru Geografi',
        subject: 'Geografi SMA',
        schoolName: 'SMA',
        academicYear: '2024/2025',
        semester: 'Ganjil',
        pin: '1234',
      },
      classes: [],
      students: [],
      materials: [],
      assignments: [],
      submissions: [],
      appreciations: [],
      quizzes: [],
      bankQuestions: [],
      activeClassId: 'all',
      supabase: {
        url: '',
        anonKey: '',
        connected: false,
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyState));
    return emptyState;
  }
}
