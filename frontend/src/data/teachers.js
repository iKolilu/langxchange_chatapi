/**
 * GES PLC Pilot Teachers Dataset
 * Phone numbers are in format: 233XXXXXXXXX (Ghana international format)
 * Roles: Head Teacher | SSIO | Curriculum Lead | Class Teacher | Subject Teacher
 */

export const SUBJECTS = [
    'Mathematics', 'English Language', 'Science', 'Social Studies',
    'Ghanaian Language', 'Creative Arts', 'Physical Education',
    'Religious & Moral Education', 'Computing/ICT', 'French',
];

export const ROLES = {
    HEAD_TEACHER: 'Head Teacher',
    SSIO: 'SSIO',
    CURRICULUM_LEAD: 'Curriculum Lead',
    CLASS_TEACHER: 'Class Teacher',
    SUBJECT_TEACHER: 'Subject Teacher',
};

// Pilot Schools lookup
export const PILOT_SCHOOLS = [
    // -- Western / Shama Municipal --
    { id: 'WS001', name: 'Shama Model Basic', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS002', name: 'Nyankrom D/A BSchool', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS003', name: 'Nkwantakesedo Methodist BSchool', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS004', name: 'Shama Methodist Basic', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS005', name: 'Dwomo Methodist Basic', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS006', name: 'Sekondi School For the Deaf', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS007', name: 'Inchaban Methodist', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS008', name: 'Inchaban Catholic', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS009', name: 'Ohiamadwen BSchool', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS010', name: 'Aboadze-Abuesi D/A C', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS011', name: 'Aboadze Islamic BB', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS012', name: 'Amenano Model BSchool', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS013', name: 'Obinnyimokyena D/A Basic', district: 'Shama Municipal', region: 'Western' },
    { id: 'WS014', name: 'Atta Na Atta D/A Basic', district: 'Shama Municipal', region: 'Western' },
    // -- Bono / Jaman South --
    { id: 'BJ001', name: 'Adamsu Presby', district: 'Jaman South', region: 'Bono' },
    { id: 'BJ002', name: 'Drobo M/A', district: 'Jaman South', region: 'Bono' },
    { id: 'BJ003', name: 'Dwenem Methodist', district: 'Jaman South', region: 'Bono' },
    { id: 'BJ004', name: 'Miremano M/A', district: 'Jaman South', region: 'Bono' },
    { id: 'BJ005', name: 'Drobo Ebenezer Presby', district: 'Jaman South', region: 'Bono' },
    { id: 'BJ006', name: 'Drobo Demonstration M/A', district: 'Jaman South', region: 'Bono' },
    { id: 'BJ007', name: 'Japekrom Presby', district: 'Jaman South', region: 'Bono' },
    { id: 'BJ008', name: "St. Anthony R/C", district: 'Jaman South', region: 'Bono' },
    // -- Central / Assin Fosu --
    { id: 'CA001', name: "Methodist 'A' BSchool", district: 'Assin Fosu', region: 'Central' },
    { id: 'CA002', name: "Methodist 'B' BSchool", district: 'Assin Fosu', region: 'Central' },
    { id: 'CA003', name: 'Railway Station A BSchool', district: 'Assin Fosu', region: 'Central' },
    { id: 'CA004', name: 'Railway Station B BSchool', district: 'Assin Fosu', region: 'Central' },
    { id: 'CA005', name: 'Atonsu M/A BSchool', district: 'Assin Fosu', region: 'Central' },
    { id: 'CA006', name: 'Akwanhyiam BSchool', district: 'Assin Fosu', region: 'Central' },
    { id: 'CA007', name: 'Wurakese Catholic BSchool', district: 'Assin Fosu', region: 'Central' },
    { id: 'CA008', name: 'Nyankomasi Catholic BSchool', district: 'Assin Fosu', region: 'Central' },
    // -- Volta / Adaklu Waya --
    { id: 'VA001', name: 'Adaklu Dzakpo D.A BSchool', district: 'Adaklu Waya', region: 'Volta' },
    { id: 'VA002', name: 'Adaklu Dorkpo D.A Primary School', district: 'Adaklu Waya', region: 'Volta' },
    { id: 'VA003', name: 'Adaklu Avelebe D.A BSchool', district: 'Adaklu Waya', region: 'Volta' },
    { id: 'VA004', name: 'Adaklu Akatsixoe D.A Primary School', district: 'Adaklu Waya', region: 'Volta' },
    { id: 'VA005', name: 'Adaklu Kordiabe E.P. BSchool', district: 'Adaklu Waya', region: 'Volta' },
    { id: 'VA006', name: 'Adaklu Seva D.A Primary School', district: 'Adaklu Waya', region: 'Volta' },
    { id: 'VA007', name: 'Adaklu Avedzi D.A Primary School', district: 'Adaklu Waya', region: 'Volta' },
    { id: 'VA008', name: 'Adaklu Aziedukofe DA BSchool', district: 'Adaklu Waya', region: 'Volta' },
    // -- Greater Accra / Doblo Gorno --
    { id: 'GA001', name: 'Doblo Gonno Methodist BSchool', district: 'Doblo Gorno', region: 'Greater Accra' },
    { id: 'GA002', name: 'Kwashiekuma Methodist M/A BSchool', district: 'Doblo Gorno', region: 'Greater Accra' },
    { id: 'GA003', name: 'Yahoman Experimental BSchool', district: 'Doblo Gorno', region: 'Greater Accra' },
    { id: 'GA004', name: 'Okushiebiade Methodist BSchool', district: 'Doblo Gorno', region: 'Greater Accra' },
    { id: 'GA005', name: 'Amasaman M/A BSchool 1', district: 'Doblo Gorno', region: 'Greater Accra' },
    { id: 'GA006', name: 'Amasaman M/A BSchool 2', district: 'Doblo Gorno', region: 'Greater Accra' },
    { id: 'GA007', name: 'Fomwag Islamic School', district: 'Doblo Gorno', region: 'Greater Accra' },
    { id: 'GA008', name: 'Sacred Heart Anglican BSchool 1', district: 'Doblo Gorno', region: 'Greater Accra' },
    // -- Northern / Yendi --
    { id: 'NY001', name: 'Yendi Presby JHS', district: 'Yendi', region: 'Northern' },
    { id: 'NY002', name: 'T.I Ahmadiyya JHS', district: 'Yendi', region: 'Northern' },
    { id: 'NY003', name: 'Yendi Jubilee JHS', district: 'Yendi', region: 'Northern' },
    { id: 'NY004', name: 'Yendi Girls JHS', district: 'Yendi', region: 'Northern' },
    { id: 'NY005', name: 'Balogu M/A JHS', district: 'Yendi', region: 'Northern' },
    { id: 'NY006', name: 'Yendi SDA JHS', district: 'Yendi', region: 'Northern' },
    { id: 'NY007', name: 'Yendi Islamic No.1 JHS', district: 'Yendi', region: 'Northern' },
    { id: 'NY008', name: 'Centre For Islamic Education JHS', district: 'Yendi', region: 'Northern' },
];

/**
 * All teachers in the pilot programme.
 * Login is via phoneNumber only — each number must be unique.
 */
export const teachers = [
    // ─── WESTERN / SHAMA ──────────────────────────────────────────────
    {
        id: 1, name: 'Kwame Mensah', email: 'kwame.mensah@ges.gov.gh',
        phoneNumber: '233244100001', schoolId: 'WS001', school: 'Shama Model Basic',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.HEAD_TEACHER, class: 'Basic 2',
        subjectsTaught: ['English Language', 'Social Studies'],
    },
    {
        id: 2, name: 'Abena Owusu', email: 'abena.owusu@ges.gov.gh',
        phoneNumber: '233244100002', schoolId: 'WS001', school: 'Shama Model Basic',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 3',
        subjectsTaught: ['Mathematics', 'Science'],
    },


    {
        id: 3, name: 'Kofi Agyemang', email: 'kofi.agyemang@ges.gov.gh',
        phoneNumber: '233244100003', schoolId: 'WS002', school: 'Nyankrom D/A BSchool',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.CLASS_TEACHER, class: 'Basic 4',
        subjectsTaught: ['English Language', 'Creative Arts'],
    },
    {
        id: 4, name: 'Akosua Boateng', email: 'akosua.boateng@ges.gov.gh',
        phoneNumber: '233244100004', schoolId: 'WS003', school: 'Nkwantakesedo Methodist BSchool',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.HEAD_TEACHER, class: 'Basic 5',
        subjectsTaught: ['Mathematics', 'Science'],
    },
    {
        id: 5, name: 'Yaw Asante', email: 'yaw.asante@ges.gov.gh',
        phoneNumber: '233244100005', schoolId: 'WS004', school: 'Shama Methodist Basic',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 6',
        subjectsTaught: ['Mathematics', 'Physical Education'],
    },
    {
        id: 6, name: 'Ama Aidoo', email: 'ama.aidoo@ges.gov.gh',
        phoneNumber: '233244100006', schoolId: 'WS005', school: 'Dwomo Methodist Basic',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.CLASS_TEACHER, class: 'Basic 7',
        subjectsTaught: ['Ghanaian Language', 'Social Studies'],
    },
    {
        id: 7, name: 'Nana Ama Sarpong', email: 'nana.sarpong@ges.gov.gh',
        phoneNumber: '233244100007', schoolId: 'WS006', school: 'Sekondi School For the Deaf',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 8',
        subjectsTaught: ['English Language', 'Creative Arts'],
    },
    {
        id: 8, name: 'Kweku Baah', email: 'kweku.baah@ges.gov.gh',
        phoneNumber: '233244100008', schoolId: 'WS007', school: 'Inchaban Methodist',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.CLASS_TEACHER, class: 'Basic 9',
        subjectsTaught: ['Science', 'Social Studies'],
    },
    {
        id: 9, name: 'Efua Appiah', email: 'efua.appiah@ges.gov.gh',
        phoneNumber: '233244100009', schoolId: 'WS008', school: 'Inchaban Catholic',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.HEAD_TEACHER, class: 'Basic 1',
        subjectsTaught: ['English Language', 'Religious & Moral Education'],
    },
    {
        id: 10, name: 'Fiifi Quayson', email: 'fiifi.quayson@ges.gov.gh',
        phoneNumber: '233244100010', schoolId: 'WS009', school: 'Ohiamadwen BSchool',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 2',
        subjectsTaught: ['Mathematics', 'Computing/ICT'],
    },
    {
        id: 11, name: 'Adjoa Koomson', email: 'adjoa.koomson@ges.gov.gh',
        phoneNumber: '233244100011', schoolId: 'WS010', school: 'Aboadze-Abuesi D/A C',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.CLASS_TEACHER, class: 'Basic 3',
        subjectsTaught: ['Science', 'Mathematics'],
    },
    {
        id: 12, name: 'Ekow Egyir', email: 'ekow.egyir@ges.gov.gh',
        phoneNumber: '233244100012', schoolId: 'WS011', school: 'Aboadze Islamic BB',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 4',
        subjectsTaught: ['Religious & Moral Education', 'Social Studies'],
    },
    {
        id: 13, name: 'Maa Esi Andoh', email: 'maaesi.andoh@ges.gov.gh',
        phoneNumber: '233244100013', schoolId: 'WS012', school: 'Amenano Model BSchool',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.HEAD_TEACHER, class: 'Basic 5',
        subjectsTaught: ['English Language', 'French'],
    },
    {
        id: 14, name: 'Kojo Tawiah', email: 'kojo.tawiah@ges.gov.gh',
        phoneNumber: '233244100014', schoolId: 'WS013', school: 'Obinnyimokyena D/A Basic',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 6',
        subjectsTaught: ['Mathematics', 'Science'],
    },
    {
        id: 15, name: 'Akua Fenteng', email: 'akua.fenteng@ges.gov.gh',
        phoneNumber: '233244100015', schoolId: 'WS014', school: 'Atta Na Atta D/A Basic',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.CLASS_TEACHER, class: 'Basic 7',
        subjectsTaught: ['Creative Arts', 'Ghanaian Language'],
    },

    // ─── BONO / JAMAN SOUTH ───────────────────────────────────────────
    {
        id: 16, name: 'Yaw Donkor', email: 'yaw.donkor@ges.gov.gh',
        phoneNumber: '233554200001', schoolId: 'BJ001', school: 'Adamsu Presby',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.HEAD_TEACHER, class: 'Basic 8',
        subjectsTaught: ['English Language', 'Social Studies'],
    },
    {
        id: 17, name: 'Ama Baffour', email: 'ama.baffour@ges.gov.gh',
        phoneNumber: '233554200002', schoolId: 'BJ002', school: 'Drobo M/A',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 9',
        subjectsTaught: ['Mathematics', 'Science'],
    },
    {
        id: 18, name: 'Kwame Ntiri', email: 'kwame.ntiri@ges.gov.gh',
        phoneNumber: '233554200003', schoolId: 'BJ003', school: 'Dwenem Methodist',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.CLASS_TEACHER, class: 'Basic 1',
        subjectsTaught: ['English Language', 'Religious & Moral Education'],
    },
    {
        id: 19, name: 'Abena Kyei', email: 'abena.kyei@ges.gov.gh',
        phoneNumber: '233554200004', schoolId: 'BJ004', school: 'Miremano M/A',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 2',
        subjectsTaught: ['Ghanaian Language', 'Social Studies'],
    },
    {
        id: 20, name: 'Kofi Acheampong', email: 'kofi.acheampong@ges.gov.gh',
        phoneNumber: '233554200005', schoolId: 'BJ005', school: 'Drobo Ebenezer Presby',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.HEAD_TEACHER, class: 'Basic 3',
        subjectsTaught: ['Mathematics', 'Physical Education'],
    },
    {
        id: 21, name: 'Akosua Danso', email: 'akosua.danso@ges.gov.gh',
        phoneNumber: '233554200006', schoolId: 'BJ006', school: 'Drobo Demonstration M/A',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.CURRICULUM_LEAD, class: 'Basic 4',
        subjectsTaught: ['Mathematics', 'Science', 'English Language'],
    },
    {
        id: 22, name: 'Kweku Frimpong', email: 'kweku.frimpong@ges.gov.gh',
        phoneNumber: '233554200007', schoolId: 'BJ007', school: 'Japekrom Presby',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 5',
        subjectsTaught: ['Computing/ICT', 'Mathematics'],
    },
    {
        id: 23, name: 'Efua Sarkodie', email: 'efua.sarkodie@ges.gov.gh',
        phoneNumber: '233554200008', schoolId: 'BJ008', school: "St. Anthony R/C",
        district: 'Jaman South', region: 'Bono',
        role: ROLES.CLASS_TEACHER, class: 'Basic 6',
        subjectsTaught: ['Religious & Moral Education', 'Creative Arts'],
    },

    // ─── CENTRAL / ASSIN FOSU ─────────────────────────────────────────
    {
        id: 24, name: 'Ato Essuman', email: 'ato.essuman@ges.gov.gh',
        phoneNumber: '233204300001', schoolId: 'CA001', school: "Methodist 'A' BSchool",
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.HEAD_TEACHER, class: 'Basic 7',
        subjectsTaught: ['English Language', 'Social Studies'],
    },
    {
        id: 25, name: 'Mabel Asante', email: 'mabel.asante@ges.gov.gh',
        phoneNumber: '233204300002', schoolId: 'CA002', school: "Methodist 'B' BSchool",
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 8',
        subjectsTaught: ['Mathematics', 'Science'],
    },
    {
        id: 26, name: 'Frank Osei', email: 'frank.osei@ges.gov.gh',
        phoneNumber: '233204300003', schoolId: 'CA003', school: 'Railway Station A BSchool',
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.CLASS_TEACHER, class: 'Basic 9',
        subjectsTaught: ['Ghanaian Language', 'Creative Arts'],
    },
    {
        id: 27, name: 'Comfort Kyeremeh', email: 'comfort.kyeremeh@ges.gov.gh',
        phoneNumber: '233204300004', schoolId: 'CA004', school: 'Railway Station B BSchool',
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 1',
        subjectsTaught: ['English Language', 'French'],
    },
    {
        id: 28, name: 'Prince Inkoom', email: 'prince.inkoom@ges.gov.gh',
        phoneNumber: '233204300005', schoolId: 'CA005', school: 'Atonsu M/A BSchool',
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.HEAD_TEACHER, class: 'Basic 2',
        subjectsTaught: ['Mathematics', 'Computing/ICT'],
    },
    {
        id: 29, name: 'Gloria Mensah', email: 'gloria.mensah@ges.gov.gh',
        phoneNumber: '233204300006', schoolId: 'CA006', school: 'Akwanhyiam BSchool',
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.CURRICULUM_LEAD, class: 'Basic 3',
        subjectsTaught: ['Science', 'Social Studies', 'Mathematics'],
    },
    {
        id: 30, name: 'Bernard Kusi', email: 'bernard.kusi@ges.gov.gh',
        phoneNumber: '233204300007', schoolId: 'CA007', school: 'Wurakese Catholic BSchool',
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.CLASS_TEACHER, class: 'Basic 4',
        subjectsTaught: ['Religious & Moral Education', 'English Language'],
    },
    {
        id: 31, name: 'Cynthia Amoah', email: 'cynthia.amoah@ges.gov.gh',
        phoneNumber: '233204300008', schoolId: 'CA008', school: 'Nyankomasi Catholic BSchool',
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 5',
        subjectsTaught: ['Creative Arts', 'Physical Education'],
    },

    // ─── VOLTA / ADAKLU WAYA ──────────────────────────────────────────
    {
        id: 32, name: 'Sena Agbeko', email: 'sena.agbeko@ges.gov.gh',
        phoneNumber: '233362400001', schoolId: 'VA001', school: 'Adaklu Dzakpo D.A BSchool',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.HEAD_TEACHER, class: 'Basic 6',
        subjectsTaught: ['English Language', 'Social Studies'],
    },
    {
        id: 33, name: 'Delali Doku', email: 'delali.doku@ges.gov.gh',
        phoneNumber: '233362400002', schoolId: 'VA002', school: 'Adaklu Dorkpo D.A Primary School',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 7',
        subjectsTaught: ['Mathematics', 'Science'],
    },
    {
        id: 34, name: 'Kafui Adzah', email: 'kafui.adzah@ges.gov.gh',
        phoneNumber: '233362400003', schoolId: 'VA003', school: 'Adaklu Avelebe D.A BSchool',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.CLASS_TEACHER, class: 'Basic 8',
        subjectsTaught: ['Ghanaian Language', 'Creative Arts'],
    },
    {
        id: 35, name: 'Ayele Akpalu', email: 'ayele.akpalu@ges.gov.gh',
        phoneNumber: '233362400004', schoolId: 'VA004', school: 'Adaklu Akatsixoe D.A Primary School',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 9',
        subjectsTaught: ['Mathematics', 'Physical Education'],
    },
    {
        id: 36, name: 'Etonam Fiati', email: 'etonam.fiati@ges.gov.gh',
        phoneNumber: '233362400005', schoolId: 'VA005', school: 'Adaklu Kordiabe E.P. BSchool',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.HEAD_TEACHER, class: 'Basic 1',
        subjectsTaught: ['English Language', 'French'],
    },
    {
        id: 37, name: 'Wisdom Kpodo', email: 'wisdom.kpodo@ges.gov.gh',
        phoneNumber: '233362400006', schoolId: 'VA006', school: 'Adaklu Seva D.A Primary School',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.CURRICULUM_LEAD, class: 'Basic 2',
        subjectsTaught: ['Science', 'Mathematics', 'Computing/ICT'],
    },
    {
        id: 38, name: 'Enyonam Avevor', email: 'enyonam.avevor@ges.gov.gh',
        phoneNumber: '233362400007', schoolId: 'VA007', school: 'Adaklu Avedzi D.A Primary School',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.CLASS_TEACHER, class: 'Basic 3',
        subjectsTaught: ['Social Studies', 'Religious & Moral Education'],
    },
    {
        id: 39, name: 'Selorm Agbenyega', email: 'selorm.agbenyega@ges.gov.gh',
        phoneNumber: '233362400008', schoolId: 'VA008', school: 'Adaklu Aziedukofe DA BSchool',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 4',
        subjectsTaught: ['Ghanaian Language', 'Creative Arts'],
    },

    // ─── GREATER ACCRA / DOBLO GORNO ──────────────────────────────────
    {
        id: 40, name: 'Aku Amoako', email: 'aku.amoako@ges.gov.gh',
        phoneNumber: '233302500001', schoolId: 'GA001', school: 'Doblo Gonno Methodist BSchool',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.HEAD_TEACHER, class: 'Basic 5',
        subjectsTaught: ['English Language', 'Social Studies'],
    },
    {
        id: 41, name: 'Nii Tetteh', email: 'nii.tetteh@ges.gov.gh',
        phoneNumber: '233302500002', schoolId: 'GA002', school: 'Kwashiekuma Methodist M/A BSchool',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 6',
        subjectsTaught: ['Mathematics', 'Computing/ICT'],
    },
    {
        id: 42, name: 'Adwoa Quayson', email: 'adwoa.quayson@ges.gov.gh',
        phoneNumber: '233302500003', schoolId: 'GA003', school: 'Yahoman Experimental BSchool',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.CURRICULUM_LEAD, class: 'Basic 7',
        subjectsTaught: ['Science', 'Mathematics', 'English Language'],
    },
    {
        id: 43, name: 'Kojo Laryea', email: 'kojo.laryea@ges.gov.gh',
        phoneNumber: '233302500004', schoolId: 'GA004', school: 'Okushiebiade Methodist BSchool',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.CLASS_TEACHER, class: 'Basic 8',
        subjectsTaught: ['Creative Arts', 'Ghanaian Language'],
    },
    {
        id: 44, name: 'Shormeh Nartey', email: 'shormeh.nartey@ges.gov.gh',
        phoneNumber: '233302500005', schoolId: 'GA005', school: 'Amasaman M/A BSchool 1',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 9',
        subjectsTaught: ['Mathematics', 'Science'],
    },
    {
        id: 45, name: 'Naa Adoley', email: 'naa.adoley@ges.gov.gh',
        phoneNumber: '233302500006', schoolId: 'GA006', school: 'Amasaman M/A BSchool 2',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.HEAD_TEACHER, class: 'Basic 1',
        subjectsTaught: ['English Language', 'French'],
    },
    {
        id: 46, name: 'Alhaji Issah', email: 'alhaji.issah@ges.gov.gh',
        phoneNumber: '233302500007', schoolId: 'GA007', school: 'Fomwag Islamic School',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 2',
        subjectsTaught: ['Religious & Moral Education', 'Social Studies'],
    },
    {
        id: 47, name: 'Cynthia Lomotey', email: 'cynthia.lomotey@ges.gov.gh',
        phoneNumber: '233302500008', schoolId: 'GA008', school: 'Sacred Heart Anglican BSchool 1',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.CLASS_TEACHER, class: 'Basic 3',
        subjectsTaught: ['Physical Education', 'Creative Arts'],
    },

    // ─── NORTHERN / YENDI ─────────────────────────────────────────────
    {
        id: 48, name: 'Alhassan Mahama', email: 'alhassan.mahama@ges.gov.gh',
        phoneNumber: '233372600001', schoolId: 'NY001', school: 'Yendi Presby JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.HEAD_TEACHER, class: 'Basic 4',
        subjectsTaught: ['English Language', 'Social Studies'],
    },
    {
        id: 49, name: 'Fatima Yakubu', email: 'fatima.yakubu@ges.gov.gh',
        phoneNumber: '233372600002', schoolId: 'NY002', school: 'T.I Ahmadiyya JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 5',
        subjectsTaught: ['Mathematics', 'Science'],
    },
    {
        id: 50, name: 'Zakaria Sulemana', email: 'zakaria.sulemana@ges.gov.gh',
        phoneNumber: '233372600003', schoolId: 'NY003', school: 'Yendi Jubilee JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.CURRICULUM_LEAD, class: 'Basic 6',
        subjectsTaught: ['Mathematics', 'Computing/ICT', 'Science'],
    },
    {
        id: 51, name: 'Mariama Abdulai', email: 'mariama.abdulai@ges.gov.gh',
        phoneNumber: '233372600004', schoolId: 'NY004', school: 'Yendi Girls JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 7',
        subjectsTaught: ['English Language', 'French'],
    },
    {
        id: 52, name: 'Ibrahim Fuseini', email: 'ibrahim.fuseini@ges.gov.gh',
        phoneNumber: '233372600005', schoolId: 'NY005', school: 'Balogu M/A JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.CLASS_TEACHER, class: 'Basic 8',
        subjectsTaught: ['Social Studies', 'Ghanaian Language'],
    },
    {
        id: 53, name: 'Abiba Iddrisu', email: 'abiba.iddrisu@ges.gov.gh',
        phoneNumber: '233372600006', schoolId: 'NY006', school: 'Yendi SDA JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 9',
        subjectsTaught: ['Religious & Moral Education', 'Creative Arts'],
    },
    {
        id: 54, name: 'Mustapha Saaka', email: 'mustapha.saaka@ges.gov.gh',
        phoneNumber: '233372600007', schoolId: 'NY007', school: 'Yendi Islamic No.1 JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.HEAD_TEACHER, class: 'Basic 1',
        subjectsTaught: ['Religious & Moral Education', 'Social Studies'],
    },
    {
        id: 55, name: 'Hadiza Umar', email: 'hadiza.umar@ges.gov.gh',
        phoneNumber: '233372600008', schoolId: 'NY008', school: 'Centre For Islamic Education JHS',
        district: 'Yendi', region: 'Northern',
        role: ROLES.SUBJECT_TEACHER, class: 'Basic 2',
        subjectsTaught: ['Mathematics', 'Computing/ICT'],
    },

    // ─── SSIO (District Inspector) ────────────────────────────────────
    {
        id: 100, name: 'Solomon Addae (SSIO - Western)', email: 'solomon.addae@ges.gov.gh',
        phoneNumber: '233244900100', schoolId: 'WS001', school: 'Shama Municipal Education Office',
        district: 'Shama Municipal', region: 'Western',
        role: ROLES.SSIO, class: 'Basic 3',
        subjectsTaught: [],
    },
    {
        id: 101, name: 'Grace Boamponsem (SSIO - Bono)', email: 'grace.boamponsem@ges.gov.gh',
        phoneNumber: '233554900101', schoolId: 'BJ001', school: 'Jaman South Education Office',
        district: 'Jaman South', region: 'Bono',
        role: ROLES.SSIO, class: 'Basic 4',
        subjectsTaught: [],
    },
    {
        id: 102, name: 'Patrick Afriyie (SSIO - Central)', email: 'patrick.afriyie@ges.gov.gh',
        phoneNumber: '233204900102', schoolId: 'CA001', school: 'Assin Fosu Education Office',
        district: 'Assin Fosu', region: 'Central',
        role: ROLES.SSIO, class: 'Basic 5',
        subjectsTaught: [],
    },
    {
        id: 103, name: 'Vida Klutse (SSIO - Volta)', email: 'vida.klutse@ges.gov.gh',
        phoneNumber: '233362900103', schoolId: 'VA001', school: 'Adaklu Waya Education Office',
        district: 'Adaklu Waya', region: 'Volta',
        role: ROLES.SSIO, class: 'Basic 6',
        subjectsTaught: [],
    },
    {
        id: 104, name: 'Nii Armah (SSIO - Greater Accra)', email: 'nii.armah@ges.gov.gh',
        phoneNumber: '233302900104', schoolId: 'GA001', school: 'Doblo Gorno Education Office',
        district: 'Doblo Gorno', region: 'Greater Accra',
        role: ROLES.SSIO, class: 'Basic 7',
        subjectsTaught: [],
    },
    {
        id: 105, name: 'Fusheini Bahini (SSIO - Northern)', email: 'fusheini.bahini@ges.gov.gh',
        phoneNumber: '233372900105', schoolId: 'NY001', school: 'Yendi Education Office',
        district: 'Yendi', region: 'Northern',
        role: ROLES.SSIO, class: 'Basic 8',
        subjectsTaught: [],
    },
];

/**
 * For quick demo access in Login screen
 */
export const DEMO_LOGINS = {
    'Subject Teacher': '233244100002',   // Abena Owusu - Maths/Science
    'Head Teacher': '233244100001',   // Kwame Mensah - Shama Model
    'Curriculum Lead': '233554200006',   // Akosua Danso - Drobo Demo M/A
    'SSIO': '233244900100',   // Solomon Addae - Western
};
