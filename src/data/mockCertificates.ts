export type Certificate = {
  certificate_id: string;
  holder_name: string;
  sport: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: string;
};

const D = '2026-07-25';

function cert(id: string, name: string, sport: string): Certificate {
  return { certificate_id: id, holder_name: name, sport, issue_date: D, expiry_date: null, status: 'valid' };
}

export const MOCK_CERTIFICATES: Record<string, Certificate> = {
  // Original mock records
  'ASMG-2026-00002': { certificate_id: 'ASMG-2026-00002', holder_name: 'Chisom Okafor', sport: 'Swimming', issue_date: '2026-01-15', expiry_date: null, status: 'valid' },
  'ASMG-2026-00003': { certificate_id: 'ASMG-2026-00003', holder_name: 'Kofi Asante', sport: 'Chess', issue_date: '2026-01-20', expiry_date: null, status: 'valid' },
  'ASMG-2026-00004': { certificate_id: 'ASMG-2026-00004', holder_name: 'Fatima Nkosi', sport: 'Classical Ballet', issue_date: '2026-01-20', expiry_date: null, status: 'valid' },
  'ASMG-2026-00005': { certificate_id: 'ASMG-2026-00005', holder_name: 'Tendai Mwangi', sport: 'Martial Arts', issue_date: '2026-02-01', expiry_date: null, status: 'valid' },

  // File 1 - 1.docx
  'ASMG-2026-00006': cert('ASMG-2026-00006', 'Nathan Baraka', 'Participant'),
  'ASMG-2026-00007': cert('ASMG-2026-00007', 'Lemayian Kiplagat', 'Participant'),

  // Additional records
  'ASMG-2026-00009': cert('ASMG-2026-00009', 'Taji Njoroge', 'Participant'),
  'ASMG-2026-00010': cert('ASMG-2026-00010', 'Renson Muchina', 'Participant'),
  'ASMG-2026-00011': cert('ASMG-2026-00011', 'Renson Muchina', 'Participant'),
  'ASMG-2026-00012': cert('ASMG-2026-00012', 'Taji Njoroge', 'Participant'),

  // coach atila.docx - Club: FFK -Atila
  'ASMG-2026-00013': cert('ASMG-2026-00013', 'Julian Jayvelle', 'Sparring'),
  'ASMG-2026-00014': cert('ASMG-2026-00014', 'Falton Mwariga', 'Sparring'),
  'ASMG-2026-00015': cert('ASMG-2026-00015', 'Nathan Nzioka Kavulu', 'Sparring'),
  'ASMG-2026-00016': cert('ASMG-2026-00016', 'Bonface Mumounder', 'Sparring'),
  'ASMG-2026-00017': cert('ASMG-2026-00017', 'Lameck Shivulu', 'Sparring'),
  'ASMG-2026-00018': cert('ASMG-2026-00018', 'Ian Wambua Mativo', 'Sparring'),

  // COach gitau.docx - Club: FLEXIBLE -GITAU
  'ASMG-2026-00019': cert('ASMG-2026-00019', 'Jeremy Macharia', 'Sparring'),
  'ASMG-2026-00020': cert('ASMG-2026-00020', 'Jeremy Maiba', 'Sparring'),
  'ASMG-2026-00021': cert('ASMG-2026-00021', 'Shanice Kanana', 'Sparring'),
  'ASMG-2026-00022': cert('ASMG-2026-00022', 'Samira Mahra', 'Sparring'),
  'ASMG-2026-00023': cert('ASMG-2026-00023', 'Trevor Gitau', 'Sparring'),
  'ASMG-2026-00024': cert('ASMG-2026-00024', 'Brighton Kibe', 'Sparring'),

  // ticket_3.docx - Club: ROPHINE-PETER
  'ASMG-2026-00025': cert('ASMG-2026-00025', 'Nadia Mutave', 'Sparring'),
  'ASMG-2026-00026': cert('ASMG-2026-00026', 'Stephanie Neema', 'Sparring'),
  'ASMG-2026-00027': cert('ASMG-2026-00027', 'Leyla Wambui', 'Sparring'),
  'ASMG-2026-00028': cert('ASMG-2026-00028', 'Kayla Mwende', 'Sparring'),
  'ASMG-2026-00029': cert('ASMG-2026-00029', 'Elsa Ontweka', 'Sparring'),
  'ASMG-2026-00030': cert('ASMG-2026-00030', 'Laureen Semeyian', 'Sparring'),
  'ASMG-2026-00031': cert('ASMG-2026-00031', 'Adanna Kendah', 'Sparring'),

  // TICKET.docx - Club: VIOLA-PETER
  'ASMG-2026-00032': cert('ASMG-2026-00032', 'Lisa Mary Achieng', 'Forms'),
  'ASMG-2026-00033': cert('ASMG-2026-00033', 'Kaylee Mumbi', 'Forms'),
  'ASMG-2026-00034': cert('ASMG-2026-00034', 'AnnLuv Wanjiru', 'Sparring'),
  'ASMG-2026-00035': cert('ASMG-2026-00035', 'Tecla Karimi', 'Sparring'),
  'ASMG-2026-00036': cert('ASMG-2026-00036', 'Arianna Wanjiru', 'Forms'),
  'ASMG-2026-00037': cert('ASMG-2026-00037', 'Abigail Mutanu Muuo', 'Sparring'),
  'ASMG-2026-00038': cert('ASMG-2026-00038', 'Milan Kuria', 'Forms'),
  'ASMG-2026-00039': cert('ASMG-2026-00039', 'Leon Mwangi', 'Forms'),
  'ASMG-2026-00040': cert('ASMG-2026-00040', 'Jeff Wamiti', 'Sparring'),
  'ASMG-2026-00041': cert('ASMG-2026-00041', 'Nayla Ariella Kiran', 'Forms'),
  'ASMG-2026-00042': cert('ASMG-2026-00042', 'Rio Terrick Waithaka', 'Sparring'),
  'ASMG-2026-00043': cert('ASMG-2026-00043', 'Tiffany Wanjiru', 'Forms'),

  // TIcket.docx - Club: KKF-NEWTON
  'ASMG-2026-00044': cert('ASMG-2026-00044', 'Kaylan Muriuki Karani', 'Sparring'),
  'ASMG-2026-00045': cert('ASMG-2026-00045', 'Shawn Liam Maina', 'Sparring'),
  'ASMG-2026-00046': cert('ASMG-2026-00046', 'Joseph Muraguri', 'Sparring'),
  'ASMG-2026-00047': cert('ASMG-2026-00047', 'Prince Brevian Wachira', 'Sparring'),
  'ASMG-2026-00048': cert('ASMG-2026-00048', 'Keisha Nyambura Karani', 'Sparring'),
  'ASMG-2026-00049': cert('ASMG-2026-00049', 'Leon Wahome Ngatia', 'Sparring'),
  'ASMG-2026-00050': cert('ASMG-2026-00050', 'Zarian Damien', 'Sparring'),
  'ASMG-2026-00051': cert('ASMG-2026-00051', 'Philip Ngatia', 'Sparring'),
  'ASMG-2026-00052': cert('ASMG-2026-00052', 'Elias Will', 'Sparring'),
  'ASMG-2026-00053': cert('ASMG-2026-00053', 'Aiden Wafula', 'Sparring'),
  'ASMG-2026-00054': cert('ASMG-2026-00054', 'Kai Mwangi', 'Sparring'),
  'ASMG-2026-00055': cert('ASMG-2026-00055', 'Nathan Nguku', 'Sparring'),
  'ASMG-2026-00056': cert('ASMG-2026-00056', 'Azaniah Wambui', 'Sparring'),
  'ASMG-2026-00057': cert('ASMG-2026-00057', 'Victor Wamuyu', 'Sparring'),
  'ASMG-2026-00058': cert('ASMG-2026-00058', 'Gianna Jewel Wanjiru Wamweya', 'Sparring'),
  'ASMG-2026-00059': cert('ASMG-2026-00059', 'Gwen Marya Kemunto Wamweya', 'Sparring'),
  'ASMG-2026-00060': cert('ASMG-2026-00060', 'Haddasah Wambui Njenga', 'Sparring'),
  'ASMG-2026-00061': cert('ASMG-2026-00061', 'Natalia Njeri Waithaka', 'Sparring'),
  'ASMG-2026-00062': cert('ASMG-2026-00062', 'Terrance Kamunyu Waithaka', 'Sparring'),

  // TIckeT.docx - Club: Solomon sch - SIMON
  'ASMG-2026-00063': cert('ASMG-2026-00063', 'Nabeel Riaz Mawji', 'Sparring'),
  'ASMG-2026-00064': cert('ASMG-2026-00064', 'Denzel Eboi Lamar', 'Sparring'),
  'ASMG-2026-00065': cert('ASMG-2026-00065', 'Jolene Hope Wambua', 'Sparring'),
  'ASMG-2026-00066': cert('ASMG-2026-00066', 'Juniah Syombua Ngotho', 'Sparring'),
  'ASMG-2026-00067': cert('ASMG-2026-00067', 'Caleb Jensen Kigo', 'Sparring'),
  'ASMG-2026-00068': cert('ASMG-2026-00068', 'Harun Farahan', 'Sparring'),
  'ASMG-2026-00069': cert('ASMG-2026-00069', 'Juliette Amava Tawii', 'Sparring'),

  // Ticket.docx - Club: Little Prls Sch - David
  'ASMG-2026-00075': cert('ASMG-2026-00075', 'Blaise Njoroge Wanjau', 'Sparring'),
  'ASMG-2026-00076': cert('ASMG-2026-00076', 'Charles Baraka Ochieng', 'Sparring'),
  'ASMG-2026-00077': cert('ASMG-2026-00077', 'Chosen Maina Muiruri', 'Sparring'),
  'ASMG-2026-00078': cert('ASMG-2026-00078', 'Dylan Khayo Shitandi', 'Sparring'),
  'ASMG-2026-00079': cert('ASMG-2026-00079', 'Kytan Mangera Babere', 'Sparring'),
  'ASMG-2026-00080': cert('ASMG-2026-00080', 'Skyla Boke Babere', 'Sparring'),
  'ASMG-2026-00081': cert('ASMG-2026-00081', 'Bella Wambui Mutungi', 'Sparring'),
  'ASMG-2026-00082': cert('ASMG-2026-00082', 'Linet Mumbua', 'Sparring'),
  'ASMG-2026-00083': cert('ASMG-2026-00083', 'Ivyne Kayadi Sidika', 'Sparring'),
  'ASMG-2026-00084': cert('ASMG-2026-00084', 'Levis Nzioka Ndambuki', 'Sparring'),
  'ASMG-2026-00085': cert('ASMG-2026-00085', 'Margaret Wanjiru', 'Sparring'),
  'ASMG-2026-00086': cert('ASMG-2026-00086', 'Joseph Mwangi Gitau', 'Sparring'),
  'ASMG-2026-00087': cert('ASMG-2026-00087', 'Hedaya mali Mwangi Kimani', 'Sparring'),
  'ASMG-2026-00088': cert('ASMG-2026-00088', 'John bright Mudanya', 'Sparring'),
  'ASMG-2026-00089': cert('ASMG-2026-00089', 'Finley Thuku Mburu', 'Sparring'),
  'ASMG-2026-00090': cert('ASMG-2026-00090', 'Jayden Ndegwa Kamau', 'Sparring'),
  'ASMG-2026-00091': cert('ASMG-2026-00091', 'Cicilia Wanjiru Njathi', 'Sparring'),
  'ASMG-2026-00092': cert('ASMG-2026-00092', 'Terryann Wairimu Maina', 'Sparring'),
  'ASMG-2026-00093': cert('ASMG-2026-00093', 'Alexis Maina Ndiu', 'Sparring'),
  'ASMG-2026-00094': cert('ASMG-2026-00094', 'Maxwel Mwangi Ndiu', 'Sparring'),
  'ASMG-2026-00095': cert('ASMG-2026-00095', 'Miracle Minoo Mulungye', 'Sparring'),
  'ASMG-2026-00096': cert('ASMG-2026-00096', 'Joy Nyamai Mulu', 'Sparring'),
  'ASMG-2026-00097': cert('ASMG-2026-00097', 'Bryson Antony Mwangi Njuguna', 'Sparring'),
  'ASMG-2026-00098': cert('ASMG-2026-00098', 'Jasmine Mwanahawa Lusweti', 'Sparring'),
  'ASMG-2026-00099': cert('ASMG-2026-00099', 'Tamari Nyambura Gitonga', 'Sparring'),
  'ASMG-2026-00100': cert('ASMG-2026-00100', 'Collins Karani Mutugi', 'Sparring'),
  'ASMG-2026-00101': cert('ASMG-2026-00101', 'Israel Favor Murangiri', 'Sparring'),
  'ASMG-2026-00102': cert('ASMG-2026-00102', 'Simon Kimemia Kangara', 'Sparring'),
  'ASMG-2026-00103': cert('ASMG-2026-00103', 'Samuel Mbuthia Kangara', 'Sparring'),
  'ASMG-2026-00104': cert('ASMG-2026-00104', 'Ivy Wambui Kangara', 'Sparring'),
  'ASMG-2026-00105': cert('ASMG-2026-00105', 'Braham Mwendwa Mesesi', 'Sparring'),
  'ASMG-2026-00106': cert('ASMG-2026-00106', 'Esther Wahu Ndungu', 'Sparring'),
  'ASMG-2026-00107': cert('ASMG-2026-00107', 'Joy Waithera Kungu', 'Sparring'),
  'ASMG-2026-00108': cert('ASMG-2026-00108', 'Gift Musyoka Musango', 'Sparring'),
  'ASMG-2026-00109': cert('ASMG-2026-00109', 'Joy Tabby Kiserem', 'Sparring'),
  'ASMG-2026-00110': cert('ASMG-2026-00110', 'Samuel Kiserem', 'Sparring'),
  'ASMG-2026-00111': cert('ASMG-2026-00111', 'Collin Makasi Nyongesa', 'Sparring'),
  'ASMG-2026-00112': cert('ASMG-2026-00112', 'Daniel Njuguna Ngaruiya', 'Sparring'),
  'ASMG-2026-00113': cert('ASMG-2026-00113', 'Gideon Kiilu Nthuli', 'Sparring'),
  'ASMG-2026-00114': cert('ASMG-2026-00114', 'Amya Muthoni Kimani', 'Sparring'),
  'ASMG-2026-00115': cert('ASMG-2026-00115', 'Caleb Kamau Muriithi', 'Sparring'),
  'ASMG-2026-00116': cert('ASMG-2026-00116', 'Margaret Nungari Kihara', 'Sparring'),
  'ASMG-2026-00117': cert('ASMG-2026-00117', 'Xenia Rose', 'Sparring'),
  'ASMG-2026-00118': cert('ASMG-2026-00118', 'Leon Kabutha Kimaru', 'Sparring'),
  'ASMG-2026-00119': cert('ASMG-2026-00119', 'Marktaliah Tiyari', 'Sparring'),

  // ballet ticket_2.docx - Club: BALLET – Comet House Schl
  'ASMG-2026-00206': cert('ASMG-2026-00206', 'Valentine wangechi', 'Ballet'),
  'ASMG-2026-00207': cert('ASMG-2026-00207', 'Eve Hyeki', 'Ballet'),
  'ASMG-2026-00208': cert('ASMG-2026-00208', 'Joy Wanjiru', 'Ballet'),
  'ASMG-2026-00209': cert('ASMG-2026-00209', 'Liz Klanini', 'Ballet'),
  'ASMG-2026-00210': cert('ASMG-2026-00210', 'Ella Mwihaki', 'Ballet'),
  'ASMG-2026-00211': cert('ASMG-2026-00211', 'Anaya Nyawira', 'Ballet'),

  // st mulumba ballet ticket.docx - Club: st mulumba
  'ASMG-2026-00212': cert('ASMG-2026-00212', 'Regina Neema', 'Ballet'),
  'ASMG-2026-00213': cert('ASMG-2026-00213', 'Phyllis Kesley', 'Ballet'),
  'ASMG-2026-00214': cert('ASMG-2026-00214', 'Myra Kelly', 'Ballet'),
  'ASMG-2026-00215': cert('ASMG-2026-00215', 'Ashley Wanjiku', 'Ballet'),
  'ASMG-2026-00216': cert('ASMG-2026-00216', 'Sheen Nyawira', 'Ballet'),

  // st mulumba tkd ticket.docx - Club: st mulumba-taekwondo
  'ASMG-2026-00217': cert('ASMG-2026-00217', 'Esther Nyambura', 'Sparring'),
  'ASMG-2026-00218': cert('ASMG-2026-00218', 'Faith Claire', 'Sparring'),
  'ASMG-2026-00219': cert('ASMG-2026-00219', 'Gabriel Thuo', 'Sparring'),

  // kopala ticket.docx - Club: kopala karate
  'ASMG-2026-00220': cert('ASMG-2026-00220', 'Jay J Mugambi Mwenda', 'Sparring'),
  'ASMG-2026-00221': cert('ASMG-2026-00221', 'Niguel Muriungi Muthomi', 'Sparring'),
  'ASMG-2026-00222': cert('ASMG-2026-00222', 'Miguel Mwenda Muthomi', 'Sparring'),
  'ASMG-2026-00223': cert('ASMG-2026-00223', 'Elvin Mwangi Maina', 'Sparring'),

  // ballet ticket.docx - Club: karate -Paul
  'ASMG-2026-00224': cert('ASMG-2026-00224', 'Natasha Mwendwa', 'Sparring'),
  'ASMG-2026-00225': cert('ASMG-2026-00225', 'Israel Muchira', 'Sparring'),
  'ASMG-2026-00226': cert('ASMG-2026-00226', 'Trizah Wangari', 'Sparring'),
  'ASMG-2026-00227': cert('ASMG-2026-00227', 'Ben Gideon', 'Sparring'),
  'ASMG-2026-00228': cert('ASMG-2026-00228', 'Franklin Jobs', 'Sparring'),
  'ASMG-2026-00229': cert('ASMG-2026-00229', 'Precious Angel', 'Sparring'),
  'ASMG-2026-00230': cert('ASMG-2026-00230', 'Libb Thims', 'Sparring'),
  'ASMG-2026-00231': cert('ASMG-2026-00231', 'Laine Hardy', 'Sparring'),

  // ticket_2.docx - Club: Baha Scl- Paul
  'ASMG-2026-00233': cert('ASMG-2026-00233', 'Bradon Kioko', 'Sparring'),
  'ASMG-2026-00234': cert('ASMG-2026-00234', 'Riaan Gitonga', 'Sparring'),
  'ASMG-2026-00235': cert('ASMG-2026-00235', 'Andry Gakui', 'Sparring'),
  'ASMG-2026-00236': cert('ASMG-2026-00236', 'Natalia Muthoni', 'Sparring'),
  'ASMG-2026-00237': cert('ASMG-2026-00237', 'Jessicah Joy', 'Sparring'),
  'ASMG-2026-00238': cert('ASMG-2026-00238', 'Matthias Maina', 'Sparring'),
  'ASMG-2026-00239': cert('ASMG-2026-00239', 'Marcos Githuku', 'Sparring'),
  'ASMG-2026-00240': cert('ASMG-2026-00240', 'Celine Muthoni', 'Sparring'),
  'ASMG-2026-00241': cert('ASMG-2026-00241', 'Liam Kamau', 'Sparring'),
  'ASMG-2026-00242': cert('ASMG-2026-00242', 'Abdul Mohamed', 'Sparring'),
  'ASMG-2026-00243': cert('ASMG-2026-00243', 'Jayden Asava', 'Sparring'),
  'ASMG-2026-00244': cert('ASMG-2026-00244', 'Kylian Okeyo', 'Sparring'),

  // karate ticket.docx - Club: ACK -kopala
  'ASMG-2026-00245': cert('ASMG-2026-00245', 'Swabir Ali', 'Sparring'),
  'ASMG-2026-00246': cert('ASMG-2026-00246', 'Donita Hadassah', 'Sparring'),
  'ASMG-2026-00247': cert('ASMG-2026-00247', 'Aviel Declan', 'Sparring'),
  'ASMG-2026-00248': cert('ASMG-2026-00248', 'Ayla Grace', 'Sparring'),
  'ASMG-2026-00249': cert('ASMG-2026-00249', 'Riam Letjor Gattheep', 'Sparring'),
  'ASMG-2026-00250': cert('ASMG-2026-00250', 'Nhial Tut Nhial Deng', 'Sparring'),
  'ASMG-2026-00251': cert('ASMG-2026-00251', 'Arthur Macharia', 'Sparring'),
  'ASMG-2026-00252': cert('ASMG-2026-00252', 'Joshua Mugambi Kirimi', 'Sparring'),
  'ASMG-2026-00253': cert('ASMG-2026-00253', 'Macryan Munene', 'Sparring'),
  'ASMG-2026-00254': cert('ASMG-2026-00254', 'Tabitha Wangari', 'Sparring'),

  // ack ticket.docx - Club: KKF -simon kiarie
  'ASMG-2026-00255': cert('ASMG-2026-00255', 'Nichodemus Tsuma', 'Sparring'),
  'ASMG-2026-00256': cert('ASMG-2026-00256', 'Herman Kinyanjui', 'Sparring'),
  'ASMG-2026-00257': cert('ASMG-2026-00257', 'Austin Musau', 'Sparring'),
  'ASMG-2026-00258': cert('ASMG-2026-00258', 'Liana Jeruto', 'Sparring'),
  'ASMG-2026-00259': cert('ASMG-2026-00259', 'Levis Thondu', 'Sparring'),
  'ASMG-2026-00260': cert('ASMG-2026-00260', 'Aileen Sadie', 'Sparring'),
  'ASMG-2026-00261': cert('ASMG-2026-00261', 'Jeremy Musau', 'Sparring'),
  'ASMG-2026-00262': cert('ASMG-2026-00262', 'Andre Njuguna', 'Sparring'),
  'ASMG-2026-00263': cert('ASMG-2026-00263', 'Geofrey Mutua', 'Sparring'),
  'ASMG-2026-00264': cert('ASMG-2026-00264', 'Prince Miles', 'Sparring'),
  'ASMG-2026-00265': cert('ASMG-2026-00265', 'Michael Muendo', 'Sparring'),
  'ASMG-2026-00266': cert('ASMG-2026-00266', 'Malcom Letipat', 'Sparring'),
  'ASMG-2026-00267': cert('ASMG-2026-00267', 'Jackson Junior', 'Sparring'),
  'ASMG-2026-00268': cert('ASMG-2026-00268', 'Ivan Muuo', 'Sparring'),
  'ASMG-2026-00269': cert('ASMG-2026-00269', 'Jalen Kamau', 'Sparring'),
  'ASMG-2026-00270': cert('ASMG-2026-00270', 'Tracy Amani', 'Sparring'),
  'ASMG-2026-00271': cert('ASMG-2026-00271', 'Adrian Nyapinda', 'Sparring'),
  'ASMG-2026-00272': cert('ASMG-2026-00272', 'Tyrel Mokaya', 'Sparring'),
  'ASMG-2026-00273': cert('ASMG-2026-00273', 'Emmanuel Njuguna', 'Sparring'),

  // New batch - 25 July 2026
  'ASMG-2026-00070': cert('ASMG-2026-00070', 'Brandon Kisko', 'Participant'),
  'ASMG-2026-00071': cert('ASMG-2026-00071', 'Riaan Gitonga', 'Participant'),
  'ASMG-2026-00072': cert('ASMG-2026-00072', 'Andy Gakii', 'Participant'),
  'ASMG-2026-00073': cert('ASMG-2026-00073', 'Natalia Muthoni', 'Participant'),
  'ASMG-2026-00074': cert('ASMG-2026-00074', 'Jessicah Joy', 'Participant'),
  'ASMG-2026-00281': cert('ASMG-2026-00281', 'Matthias Maina', 'Participant'),
  'ASMG-2026-00282': cert('ASMG-2026-00282', 'Marcos Githuku', 'Participant'),
  'ASMG-2026-00283': cert('ASMG-2026-00283', 'Celine Muthoni', 'Participant'),
  'ASMG-2026-00284': cert('ASMG-2026-00284', 'Israel Muchira', 'Participant'),
  'ASMG-2026-00285': cert('ASMG-2026-00285', 'Jayden Osawa', 'Participant'),
  'ASMG-2026-00286': cert('ASMG-2026-00286', 'Kylian Okeyo', 'Participant'),
  'ASMG-2026-00287': cert('ASMG-2026-00287', 'Trizah Wangari', 'Participant'),
  'ASMG-2026-00288': cert('ASMG-2026-00288', 'Ben Gideon', 'Participant'),
  'ASMG-2026-00289': cert('ASMG-2026-00289', 'Franklin Jobs', 'Participant'),
  'ASMG-2026-00290': cert('ASMG-2026-00290', 'Precious Angel', 'Participant'),
  'ASMG-2026-00291': cert('ASMG-2026-00291', 'Liam Kamau', 'Participant'),
};

// Name lookup index (lowercase name -> certificate)
const MOCK_BY_NAME: Record<string, Certificate> = {};
for (const c of Object.values(MOCK_CERTIFICATES)) {
  MOCK_BY_NAME[c.holder_name.toLowerCase()] = c;
}

export function findMockByName(query: string): Certificate | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  // Exact match first
  if (MOCK_BY_NAME[q]) return MOCK_BY_NAME[q];
  // Partial match (contains)
  const partial = Object.values(MOCK_BY_NAME).find(c =>
    c.holder_name.toLowerCase().includes(q) || q.includes(c.holder_name.toLowerCase())
  );
  return partial || null;
}
