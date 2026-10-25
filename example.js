// Example trips loaded into each new account. Dates are shifted so Tokyo is always
// in progress (day 3 of 7) and Penang is a recent past trip. Rates keep their real ECB dates.
window.TP_EXAMPLE = {
 "trips": {
  "ex-tokyo": {
   "name": "Tokyo & Kyoto in autumn",
   "destination": "Tokyo & Kyoto, Japan",
   "start": "2026-10-22",
   "end": "2026-10-28",
   "homeCurrency": "SGD",
   "localCurrency": "JPY",
   "budget": 6000,
   "scanDefault": "SGD",
   "people": [
    {
     "id": "me",
     "name": "You"
    },
    {
     "id": "mei",
     "name": "Mei"
    },
    {
     "id": "jun",
     "name": "Jun"
    }
   ],
   "example": true,
   "ideas": [
    {
     "id": "i1",
     "title": "Ghibli Museum",
     "place": "Ghibli Museum, Mitaka",
     "type": "sightseeing",
     "notes": "Tickets sell out a month ahead"
    },
    {
     "id": "i2",
     "title": "Golden Gai bar hop",
     "place": "Golden Gai, Shinjuku",
     "type": "food",
     "notes": "Tiny bars, some charge a cover"
    },
    {
     "id": "i3",
     "title": "Kurama to Kibune hike",
     "place": "Kurama-dera, Kyoto",
     "type": "sightseeing",
     "notes": "Half day, onsen at the end"
    }
   ],
   "packing": [
    {
     "id": "p1",
     "text": "Passport (6+ months validity)",
     "cat": "Documents",
     "done": true
    },
    {
     "id": "p2",
     "text": "Travel insurance details",
     "cat": "Documents",
     "done": true
    },
    {
     "id": "p3",
     "text": "Offline copies of bookings",
     "cat": "Documents",
     "done": true
    },
    {
     "id": "p4",
     "text": "Some cash in local currency",
     "cat": "Documents",
     "done": true
    },
    {
     "id": "p5",
     "text": "Phone charger",
     "cat": "Tech",
     "done": true
    },
    {
     "id": "p6",
     "text": "Power bank",
     "cat": "Tech",
     "done": true
    },
    {
     "id": "p7",
     "text": "Universal adapter",
     "cat": "Tech",
     "done": true
    },
    {
     "id": "p8",
     "text": "Earphones",
     "cat": "Tech",
     "done": true
    },
    {
     "id": "p9",
     "text": "T-shirts",
     "cat": "Clothes",
     "done": true
    },
    {
     "id": "p10",
     "text": "Trousers / shorts",
     "cat": "Clothes",
     "done": true
    },
    {
     "id": "p11",
     "text": "Underwear & socks",
     "cat": "Clothes",
     "done": true
    },
    {
     "id": "p12",
     "text": "Light jacket",
     "cat": "Clothes",
     "done": true
    },
    {
     "id": "p13",
     "text": "Sleepwear",
     "cat": "Clothes",
     "done": true
    },
    {
     "id": "p14",
     "text": "Comfy walking shoes",
     "cat": "Clothes",
     "done": true
    },
    {
     "id": "p15",
     "text": "Toothbrush & toothpaste",
     "cat": "Toiletries",
     "done": true
    },
    {
     "id": "p16",
     "text": "Sunscreen",
     "cat": "Toiletries",
     "done": false
    },
    {
     "id": "p17",
     "text": "Medication",
     "cat": "Toiletries",
     "done": true
    },
    {
     "id": "p18",
     "text": "Deodorant",
     "cat": "Toiletries",
     "done": true
    },
    {
     "id": "p19",
     "text": "Reusable water bottle",
     "cat": "Day bag",
     "done": true
    },
    {
     "id": "p20",
     "text": "Foldable umbrella",
     "cat": "Day bag",
     "done": false
    },
    {
     "id": "p21",
     "text": "Tissues & wet wipes",
     "cat": "Day bag",
     "done": false
    },
    {
     "id": "p99",
     "text": "Omiyage list for the office",
     "cat": "Other",
     "done": false
    }
   ],
   "bookings": [
    {
     "id": "b1",
     "kind": "flight",
     "title": "SQ634 Singapore to Tokyo Haneda",
     "code": "8XQ2LM",
     "when": "2026-10-22",
     "notes": "Example code, seats 42A-C"
    },
    {
     "id": "b2",
     "kind": "stay",
     "title": "Hotel Gracery Shinjuku, 3 nights",
     "code": "GRC-448120",
     "when": "2026-10-22",
     "notes": "Example code, check-in from 2pm"
    },
    {
     "id": "b3",
     "kind": "transport",
     "title": "Shinkansen Nozomi 23, Tokyo to Kyoto",
     "code": "EX-2205-17",
     "when": "2026-10-25",
     "notes": "Example code, car 7"
    },
    {
     "id": "b4",
     "kind": "stay",
     "title": "Ryokan Yachiyo, Kyoto, 3 nights",
     "code": "KY-77310",
     "when": "2026-10-25",
     "notes": "Example code, kaiseki dinner on night 1"
    },
    {
     "id": "b5",
     "kind": "flight",
     "title": "SQ619 Osaka Kansai to Singapore",
     "code": "8XQ2LM",
     "when": "2026-10-28",
     "notes": "Example code"
    }
   ],
   "notes": "This is an example trip so you can see how everything works. Edit it, or delete it from the trip settings.\n\nSuica: tap in and out, top up at any station machine.\nUseful phrases: sumimasen (excuse me), arigatou gozaimasu (thank you), okaikei onegaishimasu (the bill, please).\nTax-free shopping: bring your passport, spend over 5,000 yen in one shop."
  },
  "ex-penang": {
   "name": "Penang food weekend",
   "destination": "George Town, Penang",
   "start": "2026-08-14",
   "end": "2026-08-16",
   "homeCurrency": "SGD",
   "localCurrency": "MYR",
   "budget": 600,
   "scanDefault": "",
   "people": [
    {
     "id": "me",
     "name": "You"
    },
    {
     "id": "mei",
     "name": "Mei"
    }
   ],
   "example": true,
   "ideas": [],
   "packing": [
    {
     "id": "q1",
     "text": "Passport",
     "cat": "Documents",
     "done": true
    },
    {
     "id": "q2",
     "text": "Stretchy trousers",
     "cat": "Clothes",
     "done": true
    }
   ],
   "bookings": [
    {
     "id": "pb1",
     "kind": "flight",
     "title": "TR2420 Singapore to Penang",
     "code": "K7PQ2Z",
     "when": "2026-08-14",
     "notes": "Example code"
    }
   ],
   "notes": "Example past trip. Char kway teow ranking: 1. Siam Road 2. Lorong Selamat."
  }
 },
 "items": {
  "ex-tokyo": {
   "it01": {
    "day": "2026-10-22",
    "time": "08:40",
    "title": "SQ634 to Tokyo Haneda",
    "place": "Singapore Changi Airport Terminal 3",
    "type": "flight",
    "cost": 3540,
    "currency": "SGD",
    "notes": "Lands 16:35",
    "expenseId": "e1"
   },
   "it02": {
    "day": "2026-10-22",
    "time": "17:30",
    "title": "Keikyu line into the city",
    "place": "Haneda Airport Terminal 3 Station",
    "type": "transport",
    "cost": 1500,
    "currency": "JPY",
    "notes": "Get Suica cards at the airport",
    "expenseId": "e3"
   },
   "it03": {
    "day": "2026-10-22",
    "time": "19:00",
    "title": "Check in: Hotel Gracery",
    "place": "Hotel Gracery Shinjuku",
    "type": "stay",
    "cost": 96000,
    "currency": "JPY",
    "notes": "Godzilla on the roof!",
    "expenseId": "e2"
   },
   "it04": {
    "day": "2026-10-22",
    "time": "20:30",
    "title": "Yakitori in Memory Lane",
    "place": "Omoide Yokocho, Shinjuku",
    "type": "food",
    "cost": 14400,
    "currency": "JPY",
    "notes": "Cash only at most stalls",
    "expenseId": "e4"
   },
   "it05": {
    "day": "2026-10-23",
    "time": "09:00",
    "title": "Meiji Jingu shrine walk",
    "place": "Meiji Jingu, Shibuya",
    "type": "sightseeing",
    "cost": null,
    "currency": "JPY",
    "notes": "Go early, it is calmer",
    "expenseId": null
   },
   "it06": {
    "day": "2026-10-23",
    "time": "11:00",
    "title": "Takeshita Street & Uniqlo",
    "place": "Takeshita Street, Harajuku",
    "type": "shopping",
    "cost": null,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it07": {
    "day": "2026-10-23",
    "time": "13:00",
    "title": "Yuzu ramen at Afuri",
    "place": "AFURI Harajuku",
    "type": "food",
    "cost": 4350,
    "currency": "JPY",
    "notes": "",
    "expenseId": "e6"
   },
   "it08": {
    "day": "2026-10-23",
    "time": "16:30",
    "title": "Shibuya Sky at sunset",
    "place": "Shibuya Sky",
    "type": "sightseeing",
    "cost": 7500,
    "currency": "JPY",
    "notes": "Timed tickets for 16:40",
    "expenseId": "e7"
   },
   "it09": {
    "day": "2026-10-23",
    "time": "19:30",
    "title": "Conveyor sushi",
    "place": "Uobei Shibuya Dogenzaka",
    "type": "food",
    "cost": 8400,
    "currency": "JPY",
    "notes": "Order on the touch screen",
    "expenseId": "e9"
   },
   "it10": {
    "day": "2026-10-24",
    "time": "07:30",
    "title": "Breakfast crawl, Tsukiji Outer Market",
    "place": "Tsukiji Outer Market",
    "type": "food",
    "cost": 9600,
    "currency": "JPY",
    "notes": "Tamagoyaki and uni",
    "expenseId": "e10"
   },
   "it11": {
    "day": "2026-10-24",
    "time": "10:00",
    "title": "teamLab Planets",
    "place": "teamLab Planets Tokyo",
    "type": "sightseeing",
    "cost": 11400,
    "currency": "JPY",
    "notes": "You walk through water, wear shorts",
    "expenseId": "e11"
   },
   "it12": {
    "day": "2026-10-24",
    "time": "14:00",
    "title": "Retro games in Akihabara",
    "place": "Super Potato, Akihabara",
    "type": "sightseeing",
    "cost": null,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it13": {
    "day": "2026-10-24",
    "time": "18:00",
    "title": "Senso-ji lit up at night",
    "place": "Senso-ji, Asakusa",
    "type": "sightseeing",
    "cost": null,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it14": {
    "day": "2026-10-24",
    "time": "20:00",
    "title": "Monjayaki dinner",
    "place": "Tsukishima Monja Street",
    "type": "food",
    "cost": 7500,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it15": {
    "day": "2026-10-25",
    "time": "09:00",
    "title": "Shinkansen to Kyoto",
    "place": "Tokyo Station",
    "type": "transport",
    "cost": 42510,
    "currency": "JPY",
    "notes": "Sit on the E side for Mt Fuji",
    "expenseId": null
   },
   "it16": {
    "day": "2026-10-25",
    "time": "12:30",
    "title": "Check in: Ryokan Yachiyo",
    "place": "Ryokan Yachiyo, Kyoto",
    "type": "stay",
    "cost": null,
    "currency": "JPY",
    "notes": "Paid at checkout",
    "expenseId": null
   },
   "it17": {
    "day": "2026-10-25",
    "time": "15:00",
    "title": "Fushimi Inari torii gates",
    "place": "Fushimi Inari Taisha",
    "type": "sightseeing",
    "cost": null,
    "currency": "JPY",
    "notes": "Climb to the Yotsutsuji viewpoint",
    "expenseId": null
   },
   "it18": {
    "day": "2026-10-25",
    "time": "19:00",
    "title": "Dinner on Pontocho",
    "place": "Pontocho Alley, Kyoto",
    "type": "food",
    "cost": 15000,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it19": {
    "day": "2026-10-26",
    "time": "07:00",
    "title": "Arashiyama bamboo grove",
    "place": "Arashiyama Bamboo Grove",
    "type": "sightseeing",
    "cost": null,
    "currency": "JPY",
    "notes": "Before the tour buses",
    "expenseId": null
   },
   "it20": {
    "day": "2026-10-26",
    "time": "10:30",
    "title": "Tenryu-ji garden",
    "place": "Tenryu-ji, Kyoto",
    "type": "sightseeing",
    "cost": 1500,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it21": {
    "day": "2026-10-26",
    "time": "12:30",
    "title": "Yudofu lunch",
    "place": "Shoraian, Arashiyama",
    "type": "food",
    "cost": 12000,
    "currency": "JPY",
    "notes": "Book a riverside table",
    "expenseId": null
   },
   "it22": {
    "day": "2026-10-26",
    "time": "16:00",
    "title": "Kinkaku-ji, the Golden Pavilion",
    "place": "Kinkaku-ji",
    "type": "sightseeing",
    "cost": 1500,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it23": {
    "day": "2026-10-27",
    "time": "09:00",
    "title": "Day trip to Nara",
    "place": "Kintetsu Kyoto Station",
    "type": "transport",
    "cost": 2280,
    "currency": "JPY",
    "notes": "Kintetsu limited express",
    "expenseId": null
   },
   "it24": {
    "day": "2026-10-27",
    "time": "10:00",
    "title": "Deer park & Todai-ji",
    "place": "Todai-ji, Nara",
    "type": "sightseeing",
    "cost": 2400,
    "currency": "JPY",
    "notes": "Deer crackers 200 yen",
    "expenseId": null
   },
   "it25": {
    "day": "2026-10-27",
    "time": "18:00",
    "title": "Nishiki Market snacks",
    "place": "Nishiki Market, Kyoto",
    "type": "food",
    "cost": 6000,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it26": {
    "day": "2026-10-28",
    "time": "10:00",
    "title": "Check out & last omiyage",
    "place": "Kyoto Station",
    "type": "shopping",
    "cost": null,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it27": {
    "day": "2026-10-28",
    "time": "12:30",
    "title": "Haruka express to Kansai Airport",
    "place": "Kyoto Station",
    "type": "transport",
    "cost": 10800,
    "currency": "JPY",
    "notes": "",
    "expenseId": null
   },
   "it28": {
    "day": "2026-10-28",
    "time": "16:25",
    "title": "SQ619 home",
    "place": "Kansai International Airport",
    "type": "flight",
    "cost": null,
    "currency": "JPY",
    "notes": "Lands 22:10",
    "expenseId": null
   }
  },
  "ex-penang": {
   "pi1": {
    "day": "2026-08-14",
    "time": "18:00",
    "title": "Hawker dinner at Gurney Drive",
    "place": "Gurney Drive Hawker Centre",
    "type": "food",
    "cost": 80,
    "currency": "MYR",
    "notes": "",
    "expenseId": null
   },
   "pi2": {
    "day": "2026-08-15",
    "time": "09:00",
    "title": "Street art walk",
    "place": "Armenian Street, George Town",
    "type": "sightseeing",
    "cost": null,
    "currency": "MYR",
    "notes": "",
    "expenseId": null
   },
   "pi3": {
    "day": "2026-08-15",
    "time": "12:30",
    "title": "Siam Road char kway teow",
    "place": "Siam Road Char Koay Teow",
    "type": "food",
    "cost": 30,
    "currency": "MYR",
    "notes": "",
    "expenseId": null
   },
   "pi4": {
    "day": "2026-08-16",
    "time": "10:00",
    "title": "Penang Hill funicular",
    "place": "Penang Hill Lower Station",
    "type": "transport",
    "cost": 60,
    "currency": "MYR",
    "notes": "",
    "expenseId": null
   }
  }
 },
 "expenses": {
  "ex-tokyo": {
   "e1": {
    "date": "2026-10-01",
    "merchant": "Singapore Airlines, 3 return tickets",
    "amount": 3540,
    "currency": "SGD",
    "homeCurrency": "SGD",
    "rate": 1,
    "rateSource": "Same currency",
    "rateDate": "2026-10-01",
    "rateFetchedAt": "2026-10-22T16:05:00Z",
    "rateManual": false,
    "homeAmount": 3540,
    "category": "transport",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it01",
    "note": "",
    "needsReview": false
   },
   "e10": {
    "date": "2026-10-24",
    "merchant": "Tsukiji Outer Market",
    "amount": 9600,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00815338,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-23",
    "rateFetchedAt": "2026-10-23T16:05:00Z",
    "rateManual": false,
    "homeAmount": 78.27,
    "category": "food",
    "paidBy": "jun",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it10",
    "note": "",
    "needsReview": false
   },
   "e11": {
    "date": "2026-10-24",
    "merchant": "teamLab Planets",
    "amount": 11400,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00815338,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-23",
    "rateFetchedAt": "2026-10-23T16:05:00Z",
    "rateManual": false,
    "homeAmount": 92.95,
    "category": "activities",
    "paidBy": "mei",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it11",
    "note": "",
    "needsReview": false
   },
   "e12": {
    "date": "2026-10-23",
    "merchant": "Suica top-ups",
    "amount": 9000,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00815338,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-23",
    "rateFetchedAt": "2026-10-23T16:05:00Z",
    "rateManual": false,
    "homeAmount": 73.38,
    "category": "transport",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   },
   "e2": {
    "date": "2026-10-22",
    "merchant": "Hotel Gracery Shinjuku",
    "amount": 96000,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00813491,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-22",
    "rateFetchedAt": "2026-10-22T16:05:00Z",
    "rateManual": false,
    "homeAmount": 780.95,
    "category": "stay",
    "paidBy": "mei",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it03",
    "note": "",
    "needsReview": false
   },
   "e3": {
    "date": "2026-10-22",
    "merchant": "Keikyu line",
    "amount": 1500,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00813491,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-22",
    "rateFetchedAt": "2026-10-22T16:05:00Z",
    "rateManual": false,
    "homeAmount": 12.2,
    "category": "transport",
    "paidBy": "jun",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it02",
    "note": "",
    "needsReview": false
   },
   "e4": {
    "date": "2026-10-22",
    "merchant": "Omoide Yokocho yakitori",
    "amount": 14400,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00813491,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-22",
    "rateFetchedAt": "2026-10-22T16:05:00Z",
    "rateManual": false,
    "homeAmount": 117.14,
    "category": "food",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it04",
    "note": "",
    "needsReview": false
   },
   "e5": {
    "date": "2026-10-20",
    "merchant": "Travel eSIM, 7 days x3",
    "amount": 36,
    "currency": "SGD",
    "homeCurrency": "SGD",
    "rate": 1,
    "rateSource": "Same currency",
    "rateDate": "2026-10-20",
    "rateFetchedAt": "2026-10-22T16:05:00Z",
    "rateManual": false,
    "homeAmount": 36,
    "category": "other",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   },
   "e6": {
    "date": "2026-10-23",
    "merchant": "AFURI Harajuku",
    "amount": 4350,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00815338,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-23",
    "rateFetchedAt": "2026-10-23T16:05:00Z",
    "rateManual": false,
    "homeAmount": 35.47,
    "category": "food",
    "paidBy": "mei",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it07",
    "note": "",
    "needsReview": false
   },
   "e7": {
    "date": "2026-10-23",
    "merchant": "Shibuya Sky",
    "amount": 7500,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00815338,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-23",
    "rateFetchedAt": "2026-10-23T16:05:00Z",
    "rateManual": false,
    "homeAmount": 61.15,
    "category": "activities",
    "paidBy": "jun",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it08",
    "note": "",
    "needsReview": false
   },
   "e8": {
    "date": "2026-10-23",
    "merchant": "Uniqlo Harajuku",
    "amount": 12900,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00815338,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-23",
    "rateFetchedAt": "2026-10-23T16:05:00Z",
    "rateManual": false,
    "homeAmount": 105.18,
    "category": "shopping",
    "paidBy": "me",
    "splitAmong": [
     "me"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   },
   "e9": {
    "date": "2026-10-23",
    "merchant": "Uobei sushi",
    "amount": 8400,
    "currency": "JPY",
    "homeCurrency": "SGD",
    "rate": 0.00815338,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-10-23",
    "rateFetchedAt": "2026-10-23T16:05:00Z",
    "rateManual": false,
    "homeAmount": 68.49,
    "category": "food",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei",
     "jun"
    ],
    "receipt": null,
    "itemId": "it09",
    "note": "",
    "needsReview": false
   }
  },
  "ex-penang": {
   "pe1": {
    "date": "2026-08-14",
    "merchant": "Scoot flights x2",
    "amount": 236,
    "currency": "SGD",
    "homeCurrency": "SGD",
    "rate": 1,
    "rateSource": "Same currency",
    "rateDate": "2026-08-14",
    "rateFetchedAt": "2026-08-14T16:05:00Z",
    "rateManual": false,
    "homeAmount": 236,
    "category": "transport",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   },
   "pe2": {
    "date": "2026-08-14",
    "merchant": "Seven Terraces, 2 nights",
    "amount": 820,
    "currency": "MYR",
    "homeCurrency": "SGD",
    "rate": 0.31280283,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-08-14",
    "rateFetchedAt": "2026-08-14T16:05:00Z",
    "rateManual": false,
    "homeAmount": 256.5,
    "category": "stay",
    "paidBy": "mei",
    "splitAmong": [
     "me",
     "mei"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   },
   "pe3": {
    "date": "2026-08-14",
    "merchant": "Gurney Drive hawkers",
    "amount": 80,
    "currency": "MYR",
    "homeCurrency": "SGD",
    "rate": 0.31280283,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-08-14",
    "rateFetchedAt": "2026-08-14T16:05:00Z",
    "rateManual": false,
    "homeAmount": 25.02,
    "category": "food",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   },
   "pe4": {
    "date": "2026-08-15",
    "merchant": "Siam Road char kway teow",
    "amount": 30,
    "currency": "MYR",
    "homeCurrency": "SGD",
    "rate": 0.31280283,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-08-14",
    "rateFetchedAt": "2026-08-14T16:05:00Z",
    "rateManual": false,
    "homeAmount": 9.38,
    "category": "food",
    "paidBy": "mei",
    "splitAmong": [
     "me",
     "mei"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   },
   "pe5": {
    "date": "2026-08-16",
    "merchant": "Penang Hill",
    "amount": 60,
    "currency": "MYR",
    "homeCurrency": "SGD",
    "rate": 0.31280283,
    "rateSource": "ECB via Frankfurter",
    "rateDate": "2026-08-14",
    "rateFetchedAt": "2026-08-14T16:05:00Z",
    "rateManual": false,
    "homeAmount": 18.77,
    "category": "activities",
    "paidBy": "me",
    "splitAmong": [
     "me",
     "mei"
    ],
    "receipt": null,
    "itemId": null,
    "note": "",
    "needsReview": false
   }
  }
 },
 "rates": [
  {
   "date": "2026-08-14",
   "base": "EUR",
   "source": "ECB via Frankfurter",
   "rates": {
    "AUD": 1.6333,
    "BRL": 5.9873,
    "CAD": 1.6049,
    "CHF": 0.939,
    "CNY": 7.7977,
    "CZK": 24.205,
    "DKK": 7.4757,
    "GBP": 0.8545,
    "HKD": 9.077,
    "HUF": 362.58,
    "IDR": 20573.53,
    "ILS": 3.4118,
    "INR": 110.3818,
    "ISK": 142.2,
    "JPY": 183.93,
    "KRW": 1632.42,
    "MXN": 19.6592,
    "MYR": 4.7263,
    "NOK": 10.9325,
    "NZD": 1.9642,
    "PHP": 71.008,
    "PLN": 4.3068,
    "RON": 5.2427,
    "SEK": 10.999,
    "SGD": 1.4784,
    "THB": 38.316,
    "TRY": 55.3879,
    "USD": 1.1567,
    "ZAR": 18.6978
   },
   "fetchedAt": "2026-08-14T16:05:00Z"
  },
  {
   "date": "2026-10-22",
   "base": "EUR",
   "source": "ECB via Frankfurter",
   "rates": {
    "AUD": 1.598,
    "BRL": 5.6574,
    "CAD": 1.5725,
    "CHF": 0.9211,
    "CNY": 7.4786,
    "CZK": 24.26,
    "DKK": 7.4747,
    "GBP": 0.8377,
    "HKD": 8.7845,
    "HUF": 366.43,
    "IDR": 20253.88,
    "ILS": 3.4824,
    "INR": 106.249,
    "ISK": 136.2,
    "JPY": 175.97,
    "KRW": 1484.25,
    "MXN": 21.0215,
    "MYR": 4.5756,
    "NOK": 10.488,
    "NZD": 1.9724,
    "PHP": 71.162,
    "PLN": 4.3695,
    "RON": 5.345,
    "SEK": 11.112,
    "SGD": 1.4315,
    "THB": 37.811,
    "TRY": 55.6079,
    "USD": 1.1205,
    "ZAR": 18.5058
   },
   "fetchedAt": "2026-10-22T16:05:00Z"
  },
  {
   "date": "2026-10-23",
   "base": "EUR",
   "source": "ECB via Frankfurter",
   "rates": {
    "AUD": 1.5939,
    "BRL": 5.6485,
    "CAD": 1.5665,
    "CHF": 0.9227,
    "CNY": 7.466,
    "CZK": 24.327,
    "DKK": 7.4748,
    "GBP": 0.83728,
    "HKD": 8.7793,
    "HUF": 366.73,
    "IDR": 20268.06,
    "ILS": 3.4939,
    "INR": 106.272,
    "ISK": 136.2,
    "JPY": 175.51,
    "KRW": 1482.46,
    "MXN": 21.0226,
    "MYR": 4.5729,
    "NOK": 10.4665,
    "NZD": 1.9682,
    "PHP": 71.235,
    "PLN": 4.3945,
    "RON": 5.3492,
    "SEK": 11.131,
    "SGD": 1.431,
    "THB": 37.771,
    "TRY": 55.6715,
    "USD": 1.1193,
    "ZAR": 18.5777
   },
   "fetchedAt": "2026-10-23T16:05:00Z"
  }
 ],
 "anchor": {
  "ex-tokyo": [
   "2026-10-22",
   -2
  ],
  "ex-penang": [
   "2026-08-14",
   -71
  ]
 }
};
