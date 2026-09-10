export const PROVINCES = [
  "Western Province", "Central Province", "Southern Province",
  "Uva Province", "Sabaragamuwa Province", "North Western Province",
  "North Central Province", "Northern Province", "Eastern Province"
];

export const DISTRICTS: Record<string, string[]> = {
  "Western Province": ["Colombo", "Gampaha", "Kalutara"],
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Southern Province": ["Galle", "Matara", "Hambantota"],
  "Uva Province": ["Badulla", "Monaragala"],
  "Sabaragamuwa Province": ["Kegalle", "Ratnapura"],
  "North Western Province": ["Kurunegala", "Puttalam"],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara"]
};

export const DIVISIONAL_SECS: Record<string, string[]> = {
  "Hambantota": [
    "Ambalantota", "Angunakolapelessa", "Beliatta", "Hambantota", 
    "Katuwana", "Lunugamvehera", "Okewela", "Sooriyawewa", 
    "Tangalle", "Thissamaharama", "Walasmulla", "Weeraketiya"
  ],
  "Colombo": [
    "Colombo", "Dehiwala", "Homagama", "Kaduwela", "Kesbewa", 
    "Kolonnawa", "Maharagama", "Moratuwa", "Padukka", "Ratmalana", 
    "Seethawaka", "Sri Jayawardenepura Kotte", "Thimbirigasyaya"
  ],
  "Gampaha": [
    "Attanagalla", "Biyagama", "Divulapitiya", "Dompe", "Gampaha", 
    "Ja-Ela", "Katana", "Kelaniya", "Mahara", "Minuwangoda", 
    "Mirigama", "Negombo", "Wattala"
  ],
  "Kalutara": [
    "Agalawatta", "Bandaragama", "Beruwala", "Bulathsinhala", "Dodangoda",
    "Horana", "Ingiriya", "Kalutara", "Madurawela", "Mathugama", 
    "Millaniya", "Palindanuwara", "Panadura", "Walallavita"
  ],
  "Galle": [
    "Akmeemana", "Ambalangoda", "Baddegama", "Balapitiya", "Benthota", 
    "Bope-Poddala", "Elpitiya", "Galle Four Gravets", "Habaraduwa", 
    "Hikkaduwa", "Imaduwa", "Karandeniya", "Niyagama", "Thawalama", 
    "Udugama", "Welivitiya-Divitura", "Yakkalamulla", "Gonapinuwala", "Nelwa"
  ],
  "Matara": [
    "Akuressa", "Athuraliya", "Devinuwara", "Dickwella", "Hakmana", 
    "Kamburupitiya", "Kirinda Puhulwella", "Kotapola", "Malimbada", 
    "Matara Four Gravets", "Mulatiyana", "Pasgoda", "Pitabeddara", "Thihagoda", "Welipitiya"
  ],
  "Kandy": ["Akurana", "Delthota", "Doluwa", "Ganga Ihala Korale", "Harispattuwa", "Hatharaliyadda", "Kandy", "Kundasale", "Medadumbara", "Minipe", "Panvila", "Pasbage Korale", "Pathadumbara", "Pathahewaheta", "Poojapitiya", "Thumpane", "Udadumbara", "Udapalatha", "Udunuwara", "Yatinuwara"],
  "Matale": ["Ambanganga Korale", "Dambulla", "Galewela", "Laggala-Pallegama", "Matale", "Naula", "Pallepola", "Rattota", "Ukuwela", "Wilgamuwa", "Yatawatta"],
  "Nuwara Eliya": ["Ambagamuwa", "Hanguranketha", "Kothmale", "Nuwara Eliya", "Walapane", "Norwood"],
  "Badulla": ["Badulla", "Bandarawela", "Ella", "Haldummulla", "Hali-Ela", "Haputale", "Kandaketiya", "Lunugala", "Mahiyanganaya", "Meegahakivula", "Passara", "Rideemaliyadda", "Soranathota", "Uva-Paranagama", "Welimada"],
  "Monaragala": ["Badalkumbura", "Bibile", "Buttala", "Katharagama", "Madulla", "Medagama", "Moneragala", "Sevanagala", "Siyambalanduwa", "Thanamalvila", "Wellawaya"],
  "Kegalle": ["Aranayaka", "Bulathkohupitiya", "Dehiovita", "Deraniyagala", "Galigamuwa", "Kegalle", "Mawanella", "Rambukkana", "Ruwanwella", "Warakapola", "Yatiyanthota"],
  "Ratnapura": ["Ayagama", "Balangoda", "Eheliyagoda", "Elapattha", "Embilipitiya", "Godakawela", "Imbulpe", "Kahawatta", "Kalawana", "Kiriella", "Kuruvita", "Nivithigala", "Opanayaka", "Pelmadulla", "Ratnapura", "Weligepola"],
  "Kurunegala": ["Alawwa", "Ambanpola", "Bamunakotuwa", "Bingiriya", "Ehetuwewa", "Galgamuwa", "Ganewatta", "Giribawa", "Ibbagamuwa", "Kobeigane", "Kotawehera", "Kuliyapitiya East", "Kuliyapitiya West", "Kurunegala", "Mahawa", "Mallawapitiya", "Maspotha", "Mawathagama", "Narammala", "Nikaweratiya", "Panduwasnuwara", "Pannala", "Polgahawela", "Polpithigama", "Rasnayakapura", "Rideegama", "Udubaddawa", "Wariyapola", "Weerambugedera"],
  "Puttalam": ["Anamaduwa", "Arachchikattuwa", "Chilaw", "Dankotuwa", "Kalpitiya", "Karuwalagaswewa", "Madampe", "Mahakumbukkadawala", "Mahawewa", "Mundalama", "Nattandiya", "Nawagattegama", "Pallama", "Puttalam", "Vanathavilluwa", "Wennappuwa"],
  "Anuradhapura": ["Galenbindunuwewa", "Galnewa", "Galgamuwa", "Horowpothana", "Ipalogama", "Kahatagasdigiliya", "Kebithigollewa", "Kekirawa", "Mahavilachchiya", "Medawachchiya", "Mihinthale", "Nachchadoowa", "Nochchiyagama", "Nuwaragam Palatha Central", "Nuwaragam Palatha East", "Padaviya", "Palagala", "Palugaswewa", "Rajanganaya", "Rambewa", "Thalawa", "Thambuttegama", "Thirappane"],
  "Polonnaruwa": ["Dimbulagala", "Elahera", "Hingurakgoda", "Lankapura", "Medirigiriya", "Thamankaduwa", "Welikanda"],
  "Jaffna": ["Delft", "Island North", "Island South", "Jaffna", "Karainagar", "Nallur", "Thenmaradchi", "Vadamaradchi East", "Vadamaradchi North", "Vadamaradchi South-West", "Valikamam East", "Valikamam North", "Valikamam South", "Valikamam South-West", "Valikamam West"],
  "Kilinochchi": ["Kandavalai", "Karachchi", "Pachchilaipalli", "Poonakary"],
  "Mannar": ["Madhu", "Mannar", "Manthai West", "Musalai", "Nanaddan"],
  "Mullaitivu": ["Manthai East", "Maritimepattu", "Oddusuddan", "Puthukudiyiruppu", "Thunukkai", "Welioya"],
  "Vavuniya": ["Vavuniya", "Vavuniya North", "Vavuniya South", "Vengalacheddikulam"],
  "Trincomalee": ["Gomarankadawala", "Kantalai", "Kinniya", "Kuchchaveli", "Morawewa", "Muttur", "Padavi Sri Pura", "Seruvila", "Thampalakamam", "Trincomalee Town and Gravets", "Verugal"],
  "Batticaloa": ["Eravur Pattu", "Eravur Town", "Kattankudy", "Koralai Pattu", "Koralai Pattu Central", "Koralai Pattu North", "Koralai Pattu South", "Koralai Pattu West", "Manmunai North", "Manmunai Pattu", "Manmunai South and Eruvil Pattu", "Manmunai South-West", "Manmunai West", "Porativu Pattu"],
  "Ampara": ["Addalachchenai", "Akkaraipattu", "Alayadiwembu", "Ampara", "Damana", "Dehiattakandiya", "Irakkamam", "Kalmunai", "Karaitivu", "Lahugala", "Mahaoya", "Navithanveli", "Nintavur", "Padiyathalawa", "Pottuvil", "Samanthurai", "Thirukkovil", "Uhana"]
};

export const GN_DIVISIONS: Record<string, {id: string, name: string}[]> = {
  "Weeraketiya": [
    { id: "381", name: "Bedigama South" },
    { id: "382", name: "Bedigama East" },
    { id: "383", name: "Bedigama North" },
    { id: "384", name: "Medagoda" },
    { id: "385", name: "Bedigama West" },
    { id: "386", name: "Kuda Bedigama" },
    { id: "387", name: "Weeraketiya East" },
    { id: "388", name: "Weeraketiya West" },
    { id: "389", name: "Mandaduwa" },
    { id: "390", name: "Agrahera" },
    { id: "391", name: "Buddiyagama East" },
    { id: "392", name: "Buddiyagama West" },
    { id: "394", name: "Mulgirigala South" },
    { id: "395", name: "Mulgirigala East" },
    { id: "436", name: "Raluwa" },
    { id: "397", name: "Udukiriwila" },
    { id: "398", name: "Yakgasmulla" },
    { id: "399", name: "Medamulana" },
    { id: "400", name: "Degampotha" },
    { id: "401", name: "Siyambalaheddawa" },
    { id: "417", name: "Kuda Bibula South" },
    { id: "402", name: "Kinchigune East" },
    { id: "403", name: "Kinchigune South" },
    { id: "404", name: "Kinchigune West" },
    { id: "441", name: "Meegasara" },
    { id: "442", name: "Medagama" },
    { id: "424", name: "Kandamadiththa" },
    { id: "405", name: "Kemegala" },
    { id: "406", name: "Morayaya South" },
    { id: "407", name: "Morayaya North" },
    { id: "408", name: "Wekandawala North" },
    { id: "409", name: "Wekandawala South" },
    { id: "410", name: "Debokkawa East" },
    { id: "411", name: "Debokkawa West" },
    { id: "412", name: "Thelambuyaya" },
    { id: "413", name: "Ihala Gonadeniya" },
    { id: "414", name: "Pahala Gonadeniya" },
    { id: "415", name: "Ambakolawewa North" },
    { id: "416", name: "Ambakolawewa South" },
    { id: "427", name: "Kaluwagahayaya" },
    { id: "418", name: "Kudabibula North" },
    { id: "419", name: "Galpoththayaya South" },
    { id: "420", name: "Galpoththayaya North" },
    { id: "421", name: "Heelage Aina" },
    { id: "422", name: "Handapangala Aina" },
    { id: "423", name: "Malhewage Aina" },
    { id: "425", name: "Mulanyaya" },
    { id: "426", name: "Kudagalara" },
    { id: "428", name: "Okandayaya North" },
    { id: "429", name: "Okandayaya West" },
    { id: "438", name: "Keppetiyawa South" },
    { id: "439", name: "Keppetiyawa North" },
    { id: "440", name: "Buddiyagama North" },
    { id: "393", name: "Mulgirigala West" },
    { id: "396", name: "Mulgirigala North" },
    { id: "443", name: "Iththademaliya South" },
    { id: "444", name: "Iththademaliya West" },
    { id: "445", name: "Iththademaliya East" },
    { id: "446", name: "Athubonde East" },
    { id: "447", name: "Athubonde West" }
  ]
};
