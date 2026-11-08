/* ---------- ampliación de la base de alimentos (por 100 g, aproximado) ----------
   Formato: [nombre, kcal, proteína, carbohidratos, grasas, fibra, azúcar, sodio mg]
   Se añade a BASE; los ids van como "e0", "e1"… para no chocar con los de data.js. */
const EXTRA = [
/* cereales, pan y pasta */
["Arroz basmati cocido",121,3.5,25,.4,.4,0,1],["Arroz bomba cocido",130,2.6,28.5,.3,.3,0,1],["Cuscús cocido",112,3.8,23,.2,1.4,.1,5],["Quinoa cocida",120,4.4,21,1.9,2.8,.9,7],
["Bulgur cocido",83,3.1,18.6,.2,4.5,.1,5],["Pasta integral cocida",124,5.3,25,.5,3.9,.6,3],["Macarrones crudos",360,12.5,72,1.5,3.2,2.7,6],["Espaguetis crudos",359,12.5,72,1.5,3.2,2.7,6],
["Fideos de arroz cocidos",109,.9,25,.2,.9,0,3],["Pan de molde blanco",266,8.5,49,3.6,2.7,5,490],["Pan de centeno",259,8.5,48,3.3,5.8,3.9,660],["Baguette",270,9,55,1.2,2.5,3,570],
["Tostada de pan integral",290,12,48,4,7,5,500],["Tortilla de trigo (wrap)",312,8,52,7.5,2.5,3,700],["Tortita de arroz",387,8,82,2.8,1.5,.8,30],["Tortita de maíz",385,7,80,3,5,1,30],
["Cereales de maíz (corn flakes)",375,7,84,.9,3,8,650],["Muesli sin azúcar",363,10,66,6,9,12,15],["Granola",450,10,64,17,6,20,40],["Harina de trigo",364,10,76,1,2.7,.3,2],
["Harina de avena",389,13.5,66,7,10,1,3],["Maíz dulce en lata",86,3.3,19,1.4,2,6,260],["Palomitas sin mantequilla",387,13,78,4.5,15,.9,8],["Pan rallado",395,13,72,5,4.5,6,730],
["Croissant",406,8.2,46,21,2.6,11,420],["Galletas María",440,7,75,12,2.5,22,350],["Galletas integrales",430,8,67,15,6,15,380],["Magdalena",420,6,52,21,1.5,28,330],
["Donut glaseado",420,5,50,23,1.5,25,300],["Bizcocho casero",350,6,52,13,1,30,260],["Empanada de atún",270,9,28,13,1.5,3,500],
/* carnes y embutidos */
["Pechuga de pavo cocida",135,30,0,1.5,0,0,60],["Pollo asado con piel",239,27,0,14,0,0,82],["Alitas de pollo",203,30,0,8,0,0,100],["Hamburguesa de ternera",254,17,0,20,0,0,75],
["Solomillo de ternera",158,26,0,6,0,0,55],["Entrecot de ternera",271,25,0,19,0,0,65],["Carne picada mixta",250,17,0,20,0,0,80],["Costillas de cerdo",277,22,0,21,0,0,80],
["Panceta",518,9,0,53,0,0,1700],["Chorizo",455,24,2,38,0,1,1700],["Salchichón",450,25,1,38,0,0,1800],["Jamón cocido",107,18,1,3.5,0,1,1100],
["Lomo embuchado",290,50,0,10,0,0,1700],["Morcilla de arroz",300,12,10,24,.5,1,900],["Salchicha frankfurt",290,11,3,26,0,1,900],["Cordero asado",250,25,0,17,0,0,70],
["Conejo guisado",173,21,0,9,0,0,50],["Pato asado",337,19,0,28,0,0,72],["Hígado de ternera",135,20,4,3.6,0,0,70],["Albóndigas de ternera",230,15,8,15,.5,1,400],
["Nuggets de pollo",260,15,16,15,1,1,500],["Pavo en lonchas bajo en sal",98,18,1,2,0,.5,600],
/* pescado y marisco */
["Salmón fresco crudo",208,20,0,13,0,0,59],["Salmón ahumado",172,25,0,8,0,0,1200],["Atún fresco",144,23,0,5,0,0,40],["Atún en aceite escurrido",198,29,0,8.2,0,0,350],
["Caballa",205,19,0,14,0,0,90],["Sardinas en lata",208,25,0,11,0,0,400],["Anchoas en aceite",210,29,0,10,0,0,3700],["Bacalao fresco",82,18,0,.7,0,0,54],
["Bacalao desalado cocido",105,23,0,1,0,0,200],["Lubina",97,18,0,2.5,0,0,70],["Dorada",96,19,0,2.5,0,0,65],["Lenguado",86,18,0,1.5,0,0,80],
["Pescadilla",85,17,0,1.5,0,0,80],["Rape",76,16,0,1.5,0,0,60],["Pez espada",144,20,0,6.7,0,0,90],["Trucha",141,20,0,6.2,0,0,52],
["Calamares",92,16,3,1.4,0,0,44],["Pulpo cocido",82,15,2,1,0,0,230],["Mejillones cocidos",172,24,7,4.5,0,0,370],["Langostinos cocidos",99,24,.2,.3,0,0,111],
["Surimi",95,8,13,.5,0,5,800],["Almejas",74,13,2.6,1,0,0,56],["Sepia",79,16,.8,.7,0,0,200],["Palitos de pescado",230,12,19,11,1,1,450],
/* huevos y lácteos */
["Huevo frito",196,14,.8,15,0,.4,207],["Huevo revuelto",148,10,1.6,11,0,1.4,145],["Tortilla francesa (2 huevos)",154,11,.6,12,0,.5,150],["Tortilla de patatas",190,6,15,12,1.2,1.5,260],
["Leche entera",63,3.2,4.7,3.6,0,4.7,44],["Leche desnatada",34,3.4,4.9,.1,0,4.9,44],["Bebida de soja",39,3.3,2.5,1.8,.4,2.5,40],["Bebida de avena",46,1,8,1.5,.8,4,40],
["Bebida de almendra",24,.5,3,1.1,.2,2.5,70],["Yogur desnatado",42,4.3,6,.1,0,6,50],["Yogur con frutas",95,3.5,15,2.5,0,14,50],["Skyr",63,11,4,.2,0,4,50],
["Kéfir",52,3.5,4.5,2,0,4.5,40],["Requesón",98,11,3.4,4.3,0,3.4,300],["Queso cottage",98,11,3.4,4.3,0,2.7,364],["Queso manchego curado",429,26,.5,35,0,.5,650],
["Queso de cabra",364,22,2,30,0,1,515],["Queso brie",334,21,.5,28,0,.5,630],["Queso parmesano",431,38,4,29,0,1,1600],["Queso en lonchas",300,18,5,22,0,3,1100],
["Queso crema",342,6,4,34,0,3.5,320],["Nata para cocinar",195,2.5,3.5,19,0,3.5,40],["Nata montada",257,2.1,12.5,22,0,12,34],["Helado de vainilla",207,3.5,24,11,.5,21,80],
["Flan de huevo",120,4.5,19,3,0,18,80],["Natillas",110,3.5,17,3,0,15,60],["Cuajada",90,5.5,6,5,0,6,45],
/* legumbres, frutos secos y semillas */
["Lentejas crudas",352,25,60,1.1,11,2,6],["Garbanzos crudos",364,19,61,6,17,11,24],["Soja texturizada",330,50,30,1,13,7,20],["Edamame",121,12,9,5,5,2,6],
["Guisantes cocidos",84,5.4,15,.2,5.5,5.9,3],["Habas cocidas",110,7.6,19,.4,5.4,2,5],["Judías verdes cocidas",35,1.9,7,.3,3.2,3.3,1],["Alubias blancas cocidas",139,9.7,25,.5,6.3,.3,6],
["Tempeh",192,20,8,11,0,0,9],["Seitán",120,24,4,1.5,.5,0,300],["Anacardos",553,18,30,44,3.3,6,12],["Pistachos",562,20,28,45,10,8,1],
["Avellanas",628,15,17,61,10,4,0],["Cacahuetes tostados",585,24,21,50,8,4,6],["Pipas de girasol",584,21,20,51,8.6,2.6,9],["Pipas de calabaza",559,30,11,49,6,1.4,7],
["Semillas de chía",486,17,42,31,34,0,16],["Semillas de lino",534,18,29,42,27,1.6,30],["Sésamo",573,18,23,50,12,.3,11],["Coco rallado",660,7,24,65,16,7,20],
["Dátiles",282,2.5,75,.4,8,63,2],["Pasas",299,3,79,.5,3.7,59,11],["Orejones de albaricoque",241,3.4,63,.5,7.3,53,10],["Ciruelas pasas",240,2.2,64,.4,7,38,2],
["Higos secos",249,3.3,64,.9,9.8,48,10],["Castañas cocidas",131,2,28,1.4,5,6,3],
/* verduras y hortalizas */
["Acelgas cocidas",20,1.9,4.1,.1,2.1,1.1,86],["Alcachofa cocida",53,2.9,12,.2,5.7,1,94],["Berenjena",25,1,6,.2,3,3.5,2],["Berenjena asada",35,.8,8.7,.2,2.5,3.2,1],
["Calabaza",26,1,6.5,.1,.5,2.8,1],["Cebolleta",32,1.8,7.3,.2,2.6,2.3,16],["Coliflor cocida",23,1.8,4.1,.5,2.3,2,15],["Col lombarda",31,1.4,7.4,.2,2.1,3.8,27],
["Col rizada (kale)",49,4.3,9,.9,3.6,2.3,38],["Coles de Bruselas cocidas",36,2.6,7.1,.5,2.6,1.4,21],["Espárragos verdes",20,2.2,3.9,.1,2.1,1.9,2],["Endivias",17,1.3,3.4,.2,3.1,.3,22],
["Judías verdes crudas",31,1.8,7,.2,2.7,3.3,6],["Puerro",61,1.5,14,.3,1.8,3.9,20],["Rábanos",16,.7,3.4,.1,1.6,1.9,39],["Remolacha cocida",44,1.7,10,.2,2,8,77],
["Rúcula",25,2.6,3.7,.7,1.6,2,27],["Tomate frito en conserva",85,1.4,10,4.5,1.5,8,350],["Tomate triturado",24,1.3,4.3,.2,1.5,3.6,120],["Tomate cherry",18,.9,3.9,.2,1.2,2.6,5],
["Ajo",149,6.4,33,.5,2.1,1,17],["Pimiento verde",20,.9,4.6,.2,1.7,2.4,3],["Pimientos del piquillo",28,1,5.5,.3,1.5,3,350],["Maíz cocido (mazorca)",96,3.4,21,1.5,2.4,4.5,15],
["Setas",25,3.3,3.3,.4,2.3,1.5,6],["Nabo",28,.9,6.4,.1,1.8,3.8,67],["Apio",16,.7,3,.2,1.6,1.8,80],["Aceitunas verdes",145,1,3.8,15,3.3,0,1560],
["Pepinillos en vinagre",12,.5,2.3,.1,1,1.1,800],["Gazpacho",45,.8,5,2.5,.8,3.5,200],["Ensalada mixta (sin aliñar)",18,1.2,3,.2,1.5,1.8,20],["Alcachofas en conserva",47,2.5,9,.5,4,1,300],
["Patata frita casera",312,3.5,40,15,3.5,.5,210],["Puré de patata",83,2,17,1,1.3,1.5,330],["Croquetas de jamón",250,8,22,14,1,2,500],["Menestra de verduras",45,3,7,.5,3,2.5,140],
/* frutas */
["Pera",57,.4,15,.1,3.1,9.8,1],["Melocotón",39,.9,10,.3,1.5,8.4,0],["Nectarina",44,1.1,11,.3,1.7,7.9,0],["Albaricoque",48,1.4,11,.4,2,9.2,1],
["Ciruela",46,.7,11,.3,1.4,10,0],["Cerezas",63,1,16,.2,2.1,13,0],["Kiwi",61,1.1,15,.5,3,9,3],["Mandarina",53,.8,13,.3,1.8,11,2],
["Pomelo",42,.8,11,.1,1.6,7,0],["Limón",29,1.1,9,.3,2.8,2.5,2],["Piña",50,.5,13,.1,1.4,10,1],["Mango",60,.8,15,.4,1.6,14,1],
["Melón",34,.8,8,.2,.9,8,16],["Sandía",30,.6,7.6,.2,.4,6.2,1],["Papaya",43,.5,11,.3,1.7,7.8,8],["Granada",83,1.7,19,1.2,4,14,3],
["Arándanos",57,.7,14,.3,2.4,10,1],["Frambuesas",52,1.2,12,.7,6.5,4.4,1],["Moras",43,1.4,10,.5,5.3,4.9,1],["Higos frescos",74,.8,19,.3,2.9,16,1],
["Chirimoya",75,1.6,18,.7,3,13,7],["Caqui",70,.6,19,.2,3.6,13,1],["Coco fresco",354,3.3,15,33,9,6,20],["Zumo de manzana",46,.1,11,.1,.2,10,4],
["Batido de frutas",55,1,12,.5,.5,11,20],["Compota de manzana",68,.2,17,.1,1.5,15,2],["Mermelada",250,.4,65,.1,1,48,20],
/* grasas, salsas y condimentos */
["Aceite de girasol",884,0,0,100,0,0,0],["Aceite de coco",862,0,0,100,0,0,0],["Margarina",717,.2,.7,80,0,.7,640],["Mayonesa",680,1,.6,75,0,.6,630],
["Mayonesa ligera",300,.5,7,30,0,3,800],["Ketchup",101,1.2,26,.1,.3,22,907],["Mostaza",66,4,6,3.3,3.3,2,1100],["Salsa de soja",53,8,5,.6,.8,.4,5500],
["Salsa de tomate casera",70,1.5,9,3,1.5,6,280],["Salsa boloñesa",110,7,6,6.5,1,4,350],["Pesto",470,5,5,48,1,2,700],["Alioli",600,1.5,2,65,0,1,500],
["Vinagre balsámico",88,.5,17,0,0,15,23],["Guacamole",150,2,8,13,5,1,350],["Tahini",595,17,21,54,9,.5,115],["Mantequilla de almendra",614,21,19,56,10,4,5],
["Salsa alioli light",250,1,8,24,0,2,600],["Sal",0,0,0,0,0,0,38758],["Caldo de pollo",8,1,.5,.2,0,.2,500],["Sofrito de tomate",95,1.5,9,6,1.5,7,400],
/* dulces, snacks y bebidas */
["Chocolate con leche",535,7.7,59,30,3.4,52,79],["Chocolate blanco",539,5.9,59,32,0,59,90],["Chocolate negro 85%",600,10,19,50,14,6,10],["Cacao en polvo puro",228,20,58,14,33,2,21],
["Crema de avellanas y cacao",539,6,58,31,3.4,56,41],["Turrón de almendra",490,12,50,27,6,45,10],["Caramelos",390,0,98,0,0,70,30],["Gominolas",340,6,77,0,0,46,20],
["Barrita de cereales",390,6,70,10,5,30,150],["Barrita de proteínas",370,33,35,12,6,6,200],["Patatas fritas onduladas",520,6,50,33,4,.5,500],["Nachos",490,7,62,25,5,2,650],
["Palomitas de microondas",450,8,55,22,8,.5,900],["Cacahuetes salados",600,25,16,52,8,4,500],["Frutos secos mixtos",607,20,21,53,7,4,10],["Aceitunas rellenas",130,1,4,12,3,0,1400],
["Refresco de cola",42,0,10.6,0,0,10.6,4],["Refresco de cola zero",0,0,0,0,0,0,10],["Agua con gas",0,0,0,0,0,0,10],["Café solo",2,.1,0,0,0,0,2],
["Café con leche",30,1.7,2.4,1.5,0,2.4,25],["Té sin azúcar",1,0,.3,0,0,0,3],["Zumo de piña",53,.4,13,.1,.2,10,2],["Bebida isotónica",26,0,6.3,0,0,5.5,41],
["Vino tinto",85,.1,2.6,0,0,.6,4],["Vino blanco",82,.1,2.6,0,0,1,5],["Cerveza sin alcohol",20,.3,4.5,0,0,0,5],["Sidra",45,0,3.5,0,0,3,5],
["Whisky o ron",230,0,0,0,0,0,1],
/* platos preparados habituales */
["Paella mixta",150,7,22,4,1,1,350],["Lentejas estofadas",105,6.5,14,2.5,4,1.5,280],["Cocido madrileño (plato)",140,10,10,6,3,1,350],["Fabada asturiana",150,8,10,8,4,.5,500],
["Gazpacho andaluz",45,.8,5,2.5,.8,3.5,200],["Ensaladilla rusa",190,3.5,10,15,1.5,2,400],["Pisto",65,1.5,7,3.5,2,5,200],["Sopa de pescado",45,5,3,1.5,.5,1,400],
["Macarrones con tomate",150,5,25,3.5,2,3.5,250],["Lasaña de carne",150,8,13,7,1,3,400],["Pizza de jamón y queso",270,12,32,10,2,3,640],["Hamburguesa con queso (completa)",260,13,24,12,1.5,5,500],
["Kebab de pollo",200,12,17,10,1.5,3,500],["Sushi (nigiri)",150,6,28,1.5,.5,5,300],["Tortilla de patata con cebolla",190,6,15,12,1.2,1.5,260],["Bocadillo de jamón",280,13,36,9,2,3,800],
["Bocadillo de tortilla",250,9,32,9,2,2,500],["Tosta de aguacate",220,5,24,12,5,2,260],["Ensalada César",160,9,7,11,1.5,2,380],["Arroz a la cubana",160,4,26,5,1,2,300],
["Pollo al ajillo",190,24,2,9,.2,0,200],["Merluza a la plancha",95,19,0,2,0,0,80],["Pescaíto frito",230,16,12,13,.5,0,300],["Calamares a la romana",250,13,20,13,1,0,420],
["Patatas bravas",190,3,24,9,2.5,1,420],["Jamón y queso (sándwich mixto)",280,14,27,13,1.5,3,850]
].map((r, i) => ({ id: "e" + i, n: r[0], k: r[1], p: r[2], c: r[3], f: r[4], fi: r[5], s: r[6], na: r[7], src: "base" }));
/* Evita duplicados por nombre con la base original. */
(() => { const seen = new Set(BASE.map(b => norm(b.n))); EXTRA.forEach(e => { const k = norm(e.n); if (!seen.has(k)) { seen.add(k); BASE.push(e); } }); })();
