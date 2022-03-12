const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon');
const mongoose = require('mongoose')

const Application = mongoose.model('Applications')
const Trip = mongoose.model('Trips')

// const Trip = require('../api/models/trip')

const { expect } = chai
chai.use(chaiHttp);
var sandbox = sinon.createSandbox();

describe('Applications', () => {
    var applications=[{
        "_id": "621bc2fc8ed42c1c26274c30",
        "creationMoment": "2017-10-01T07:06:12.000Z",
        "paid": false,
        "rejectionReason": "Veniam incididunt labore cillum duis exercitation Lorem non sint officia dolor. Voluptate laborum velit est adipisicing irure id cillum. Pariatur proident ad sunt occaecat proident do do sit consectetur deserunt cillum pariatur mollit. Officia enim magna enim eiusmod cupidatat commodo dolore. Nulla laboris labore ullamco magna in. Eiusmod sunt elit quis irure fugiat ut veniam. Sit qui ex laborum Lorem ea elit nulla laborum nulla reprehenderit irure non dolore adipisicing.\r\n",
        "comments": "Comentarios de una aplicación",
        "status": "DUE",
        "trip": "621bc2fcc4b04c8afb4931a0",
        "actor": "621bc2fc0eb01ca0e535d599",
        "__v": 0
    }]

    var application={
        "_id": "621bc2fc8ed42c1c26274c30",
        "creationMoment": "2017-10-01T07:06:12.000Z",
        "paid": false,
        "rejectionReason": "Veniam incididunt labore cillum duis exercitation Lorem non sint officia dolor. Voluptate laborum velit est adipisicing irure id cillum. Pariatur proident ad sunt occaecat proident do do sit consectetur deserunt cillum pariatur mollit. Officia enim magna enim eiusmod cupidatat commodo dolore. Nulla laboris labore ullamco magna in. Eiusmod sunt elit quis irure fugiat ut veniam. Sit qui ex laborum Lorem ea elit nulla laborum nulla reprehenderit irure non dolore adipisicing.\r\n",
        "comments": "Comentarios de una aplicación",
        "status": "DUE",
        "trip": "621bc2fcc4b04c8afb4931a0",
        "actor": "621bc2fc0eb01ca0e535d599",
        "__v": 0
    }

    var application={
        "_id": "621bc2fc8ed42c1c26274c30",
        "creationMoment": "2017-10-01T07:06:12.000Z",
        "paid": false,
        "rejectionReason": "Veniam incididunt labore cillum duis exercitation Lorem non sint officia dolor. Voluptate laborum velit est adipisicing irure id cillum. Pariatur proident ad sunt occaecat proident do do sit consectetur deserunt cillum pariatur mollit. Officia enim magna enim eiusmod cupidatat commodo dolore. Nulla laboris labore ullamco magna in. Eiusmod sunt elit quis irure fugiat ut veniam. Sit qui ex laborum Lorem ea elit nulla laborum nulla reprehenderit irure non dolore adipisicing.\r\n",
        "comments": "Comentarios de una aplicación",
        "status": "DUE",
        "trip": "621bc2fcc4b04c8afb4931a0",
        "actor": "621bc2fc0eb01ca0e535d599",
        "__v": 0
    }

    var trip={
        "_id": "622b9c78bb3ab67a6b700137",
        "actor": "622b9c789742000e530a804e",
        "state": "ACTIVE",
        "description": "Enim id occaecat enim fugiat irure consectetur ex eiusmod eu. Enim minim adipisicing cupidatat consectetur veniam dolore. Lorem elit ipsum aliqua laborum. Ex in deserunt id cillum aliqua occaecat id pariatur.\r\nAmet velit et ullamco elit nisi nulla aliqua in do velit voluptate tempor dolor aliquip. Ullamco nostrud officia exercitation mollit eu voluptate. Cupidatat excepteur proident proident ipsum magna sint aliquip exercitation laboris nulla culpa id. Nostrud mollit proident laborum sunt sit id sunt in cillum consectetur qui occaecat deserunt. Velit proident excepteur anim laboris. Laborum excepteur esse enim enim eiusmod non nisi excepteur.\r\nOccaecat tempor id eiusmod aliqua ipsum cupidatat nisi dolor. Enim laboris mollit reprehenderit exercitation nisi ipsum nostrud irure. Fugiat consectetur nulla reprehenderit in ipsum. Ullamco consectetur fugiat exercitation culpa excepteur ipsum. Officia aliqua ea consequat enim fugiat culpa enim sint reprehenderit ad. Laboris aute aliquip do cupidatat adipisicing aute aute nulla commodo fugiat.\r\nEsse aliquip eiusmod cupidatat cupidatat exercitation deserunt. Tempor nostrud deserunt ut eiusmod. Eiusmod sit velit consectetur elit ut. Exercitation nulla velit elit dolor dolor ullamco esse voluptate exercitation culpa velit. Lorem laboris voluptate duis reprehenderit.\r\nOfficia ex aute nostrud deserunt occaecat est laborum excepteur pariatur. Velit proident aliqua sit excepteur exercitation reprehenderit adipisicing sit ad voluptate incididunt aliquip reprehenderit sunt. Ex culpa ullamco id labore occaecat irure fugiat ut consequat tempor consectetur. Incididunt quis consequat est cillum sint irure id laboris tempor aliquip.\r\n",
        "endDate": "2025-01-04T09:37:36.000Z",
        "pictures": [
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32",
            "http://placehold.it/32x32"
        ],
        "requirements": "magna cillum commodo qui consequat",
        "startDate": "2023-04-15T23:08:29.000Z",
        "ticker": "170325-QTVY",
        "title": "amet aute eiusmod velit est",
        "published": true,
        "stages": [
            {
                "description": "Esse cupidatat elit nisi aliquip elit aute ea deserunt ea mollit. Commodo do officia irure sit elit cupidatat laborum sit in labore commodo veniam voluptate. Laborum labore amet nisi occaecat exercitation minim nulla incididunt adipisicing voluptate magna. Voluptate ut ut eu eiusmod officia commodo magna id consectetur do cupidatat do consectetur sint. Duis excepteur ea aliqua culpa minim ad nostrud. Irure ex nisi nisi do exercitation ex. Eu commodo occaecat culpa proident esse tempor mollit exercitation duis ipsum elit aute.\r\nAute velit qui eu elit nulla cupidatat ea esse mollit est quis aliqua. Voluptate eu ex aute consequat ullamco aliqua cupidatat laboris culpa occaecat do. Ad veniam aliquip culpa esse proident cupidatat sint non sit tempor. Nisi anim mollit est dolor irure reprehenderit sit Lorem laborum reprehenderit minim pariatur. Sunt elit anim officia minim ex anim ullamco ad sunt. Quis esse non reprehenderit fugiat qui voluptate ullamco. Adipisicing elit consequat cupidatat enim esse ex.\r\n",
                "price": 462.11,
                "title": "eu ut ex anim id",
                "_id": "622b9d0b4ac19c7c4c49bd32"
            },
            {
                "description": "Dolor eiusmod magna adipisicing excepteur. Adipisicing velit aliqua excepteur dolore mollit adipisicing sunt magna nostrud sint nostrud. Pariatur tempor cupidatat laboris enim proident. Esse excepteur cillum enim veniam incididunt ea. Aliqua pariatur veniam sit tempor sit aliquip eu. Sit sint voluptate labore ea aliqua ullamco.\r\nIrure fugiat do ullamco anim esse culpa officia ad nulla ad voluptate pariatur eiusmod. Dolor culpa eiusmod sit labore velit non. Dolore est eu ipsum laborum id. Duis dolore non excepteur pariatur fugiat occaecat deserunt duis ullamco aliqua esse.\r\n",
                "price": 158.75,
                "title": "voluptate ad est voluptate laboris",
                "_id": "622b9d0b4ac19c7c4c49bd33"
            },
            {
                "description": "Occaecat reprehenderit excepteur deserunt nisi ad incididunt. Excepteur id laboris ut velit id velit minim laborum eiusmod qui. Dolor minim ullamco est sint commodo est dolor irure sint minim quis amet consectetur pariatur. Anim esse dolore officia in elit fugiat fugiat aute commodo proident. Exercitation Lorem dolore eu fugiat in labore ad laboris commodo sint esse elit. Veniam veniam occaecat eiusmod aliqua.\r\nIncididunt ut minim est mollit id incididunt velit cupidatat aliquip laborum nisi exercitation ullamco. Reprehenderit deserunt nostrud est nulla do magna. Eiusmod duis commodo ea adipisicing anim aliqua esse. Aliquip nostrud nisi est culpa fugiat pariatur reprehenderit irure aliqua. Nisi ut sit anim ipsum cillum eiusmod nisi nostrud cillum reprehenderit do consequat.\r\n",
                "price": 437.55,
                "title": "exercitation nisi irure nulla exercitation",
                "_id": "622b9d0b4ac19c7c4c49bd34"
            },
            {
                "description": "Duis commodo Lorem deserunt incididunt sint sit sunt veniam labore. Esse id labore cillum aliquip dolor labore aliqua non labore aute esse. Magna adipisicing nisi pariatur consequat aliqua velit est laborum culpa amet minim sint pariatur. Nulla excepteur commodo laborum voluptate eu voluptate do do commodo Lorem cillum nostrud. Id minim nulla Lorem velit sint qui consequat sunt velit nisi pariatur. Nulla nisi sint Lorem laboris laboris id dolore dolore commodo quis ex Lorem. Tempor eu in ea deserunt.\r\nEu esse cupidatat pariatur ea in non ipsum quis cillum elit voluptate. Aliquip ullamco dolore laborum proident id anim incididunt duis officia qui incididunt. Dolore aute velit labore mollit sint duis. Veniam enim culpa et proident occaecat aliquip incididunt reprehenderit ex officia duis do in.\r\n",
                "price": 568.95,
                "title": "proident ullamco veniam id ex",
                "_id": "622b9d0b4ac19c7c4c49bd35"
            },
            {
                "description": "Culpa eu aute Lorem ullamco. Nostrud quis enim ex ipsum amet ipsum reprehenderit ipsum quis. Labore esse quis anim do amet minim ex.\r\nElit dolore sit proident cillum quis. Elit voluptate voluptate ex laboris laborum occaecat sit eu. Reprehenderit nulla consequat in incididunt nostrud. Anim tempor sit id non laboris exercitation nostrud sunt quis cillum elit ad aliquip dolore. Magna esse nostrud ad laboris anim ea est commodo ipsum qui ut. Laborum reprehenderit adipisicing laboris occaecat nisi occaecat excepteur minim.\r\n",
                "price": 437.14,
                "title": "id sunt proident quis tempor",
                "_id": "622b9d0b4ac19c7c4c49bd36"
            },
            {
                "description": "Duis cillum enim eu in in ipsum officia occaecat culpa deserunt magna velit. Elit aliqua reprehenderit id enim consectetur et laboris. Ex laboris excepteur nulla ut minim sint in laboris qui laboris est. Est aliquip mollit occaecat pariatur ipsum ipsum officia laborum. Minim in magna veniam mollit dolor. Lorem laborum velit sit dolor magna ipsum labore consequat ex ex ex aliqua minim aliqua.\r\nMollit minim exercitation cupidatat labore dolore exercitation in labore amet. Magna adipisicing nisi culpa dolor veniam aute duis proident proident. Eiusmod est dolore elit dolor laborum sint anim excepteur pariatur cupidatat quis. Fugiat aute nisi excepteur laborum.\r\n",
                "price": 563.67,
                "title": "sunt consectetur ullamco duis mollit",
                "_id": "622b9d0b4ac19c7c4c49bd37"
            }
        ],
        "__v": 0,
        "price": 2628.17
    }

    var applicationsByActor={
        "DUE": [
            {
                "_id": "621bc2fc8ed42c1c26274c30",
                "creationMoment": "2017-10-01T07:06:12.000Z",
                "paid": false,
                "rejectionReason": "Veniam incididunt labore cillum duis exercitation Lorem non sint officia dolor. Voluptate laborum velit est adipisicing irure id cillum. Pariatur proident ad sunt occaecat proident do do sit consectetur deserunt cillum pariatur mollit. Officia enim magna enim eiusmod cupidatat commodo dolore. Nulla laboris labore ullamco magna in. Eiusmod sunt elit quis irure fugiat ut veniam. Sit qui ex laborum Lorem ea elit nulla laborum nulla reprehenderit irure non dolore adipisicing.\r\n",
                "comments": "Comentarios de una aplicación",
                "status": "DUE",
                "trip": "621bc2fcc4b04c8afb4931a0",
                "actor": "621bc2fc0eb01ca0e535d599",
                "__v": 0
            },
            {
                "_id": "621bc2fcd0fea836f0a2f334",
                "creationMoment": "2019-04-19T05:25:12.000Z",
                "paid": true,
                "rejectionReason": "Nostrud aliqua cillum magna nostrud do aute Lorem sint. Id cillum sunt culpa nostrud exercitation culpa nostrud veniam et. Sunt non et cupidatat duis fugiat ea non ut excepteur irure mollit tempor excepteur.\r\n",
                "comments": "Laborum qui exercitation magna ad. Consectetur fugiat do laboris ex commodo pariatur mollit sint nulla aute amet. Ut aliquip sunt excepteur aliquip incididunt ad quis. Ea consequat cillum Lorem pariatur deserunt sit consequat sint anim velit est nisi et. Officia et deserunt ipsum culpa sunt sit eu.\r\nIncididunt veniam est laborum culpa aute anim laboris proident. Nisi ea quis amet esse culpa. Aute proident labore veniam mollit eu ipsum dolor enim reprehenderit. Mollit id fugiat pariatur culpa commodo sit enim commodo. Minim laborum minim ut reprehenderit officia officia est veniam est. Nulla aute dolor deserunt aute anim minim nulla minim culpa magna amet. Ad velit laboris culpa voluptate in incididunt amet adipisicing.\r\nAute elit laborum nostrud id fugiat sit ipsum. Do laboris cupidatat officia laboris magna cupidatat nisi laborum enim. Labore qui excepteur culpa cillum officia anim ad ipsum occaecat dolore minim do ullamco enim.\r\nLorem nostrud aute ex nulla deserunt consequat. Incididunt sunt quis dolor aute ullamco in laborum esse ea. In anim ut adipisicing sit elit in enim incididunt adipisicing proident pariatur aute non. Non elit sint ullamco commodo dolore aute. Non commodo non esse aliquip esse. Incididunt cupidatat dolor adipisicing incididunt proident dolore ipsum esse ad occaecat enim eu velit deserunt. Ex voluptate ea consequat laborum id ut do culpa duis nostrud occaecat.\r\nMagna dolor in reprehenderit mollit aliqua non magna sit et amet. Quis quis magna nostrud ut consequat anim laboris et velit nulla. Eiusmod laborum officia aute deserunt et dolor velit esse incididunt aliquip. Fugiat aliqua consectetur consequat elit voluptate cillum minim amet sint laborum fugiat ipsum sint magna. Aliqua ex consequat mollit laboris eiusmod consectetur ea occaecat Lorem nostrud. Sit sit sunt sunt magna proident magna laborum fugiat cillum magna dolor enim est ut. Dolore voluptate commodo labore labore ea proident ipsum deserunt enim nulla.\r\n",
                "status": "DUE",
                "trip": "621bc2fc5e10ffc0271e4ce5",
                "actor": "621bc2fc265d0fd56098d495",
                "__v": 0
            },
        ],
        "CANCELLED": [
            {
                "_id": "621bc2fc34f8a91d2755bbe1",
                "creationMoment": "2020-07-20T03:38:35.000Z",
                "paid": false,
                "rejectionReason": "Culpa non minim deserunt amet ut tempor ut laboris esse eiusmod do adipisicing. Incididunt et duis incididunt fugiat. Ullamco fugiat qui aliquip veniam magna. Voluptate proident laborum id adipisicing eiusmod dolor laboris amet dolor labore ea tempor adipisicing. Labore amet eu incididunt magna enim tempor nisi id. Sint consequat tempor non irure qui adipisicing duis Lorem cupidatat esse voluptate irure sit. Ut duis pariatur ad officia sint in minim velit aute ipsum.\r\n",
                "comments": "Proident minim exercitation consectetur et aliqua ullamco reprehenderit consequat. Mollit occaecat tempor sunt aute eiusmod elit. Sit proident consequat dolore ut. Sint consequat ullamco mollit ipsum exercitation non Lorem ipsum irure esse irure. Sint ad veniam veniam sunt aliqua eiusmod incididunt commodo qui sint tempor. Cupidatat proident enim sit nostrud ex elit irure id pariatur aliqua nisi.\r\nEnim veniam ipsum deserunt labore deserunt cillum elit duis culpa consectetur anim nisi reprehenderit do. Quis adipisicing laborum voluptate in proident nostrud voluptate fugiat minim cillum mollit cillum in. Est est occaecat voluptate officia excepteur commodo tempor Lorem sit Lorem minim. Proident occaecat mollit est in proident minim velit nisi in fugiat ex voluptate elit cillum. Nostrud non reprehenderit ex adipisicing Lorem officia reprehenderit duis id do excepteur dolor velit laboris. Ad amet tempor laborum labore fugiat ex duis dolor adipisicing do. Ut qui voluptate duis ipsum cillum culpa officia culpa ad.\r\nSint tempor elit reprehenderit adipisicing aliquip enim tempor consequat exercitation deserunt dolore officia incididunt. Laboris magna incididunt dolore id fugiat voluptate esse deserunt dolor ea anim consectetur. Aliquip do sunt tempor eiusmod.\r\nIn ipsum laborum eiusmod sunt qui. Nisi duis ut pariatur est veniam consequat ullamco laboris aliqua laboris laboris consequat laboris. Minim nulla culpa excepteur reprehenderit laboris quis nulla exercitation cillum magna deserunt. Aliquip ad non sunt sit. Minim in consectetur nisi ex magna cillum pariatur incididunt labore non. Labore est deserunt ad proident nisi consequat magna occaecat nulla elit exercitation eu nulla cupidatat. Magna Lorem exercitation laboris eiusmod exercitation dolore.\r\nDo commodo cupidatat reprehenderit officia. Culpa officia aliqua anim commodo reprehenderit veniam officia enim in sint nisi proident voluptate. Ipsum sunt quis Lorem veniam velit et excepteur laborum adipisicing consectetur pariatur eu sint culpa.\r\n",
                "status": "CANCELLED",
                "trip": "621bc2fc0e34b242b89bc72c",
                "actor": "621bc2fc41b7b7381043d2e2",
                "__v": 0
            },
        ],
        "ACEPTED": [
            {
                "_id": "621bc2fcb213121559930a0d",
                "creationMoment": "2014-05-17T09:11:55.000Z",
                "paid": false,
                "rejectionReason": "Quis fugiat ipsum ex exercitation culpa voluptate ipsum velit sint non minim cupidatat occaecat ea. Qui nostrud mollit amet cillum. Culpa et id culpa qui minim id elit excepteur ad nisi eu laborum. Duis et nostrud fugiat minim amet ipsum ullamco voluptate voluptate proident est aliqua velit. Tempor tempor officia enim incididunt nisi pariatur reprehenderit. Ullamco consequat consequat eiusmod ad esse irure proident proident est incididunt aliquip proident.\r\n",
                "comments": "Et enim ad velit Lorem non cupidatat officia ullamco incididunt. Laborum velit culpa ipsum elit aute ex sunt consequat eiusmod. Pariatur nisi veniam occaecat mollit dolor nisi excepteur pariatur ea ea voluptate ad.\r\nEx id amet elit laboris consequat sunt sunt officia mollit. Qui officia tempor adipisicing fugiat officia ipsum dolore eu eiusmod laboris nulla quis. Laborum aliquip irure labore veniam ea exercitation et consequat.\r\nSint fugiat exercitation eu est incididunt nisi. Proident duis ad adipisicing id adipisicing enim. Esse Lorem aliquip labore quis mollit quis culpa nulla adipisicing ea dolor ullamco. Deserunt et enim qui deserunt ex adipisicing. Officia incididunt amet aute culpa laboris aliquip duis ea qui nisi pariatur in non in. Aliqua ea mollit enim est ad.\r\nSit ea mollit velit dolore magna cillum id enim magna non cillum. Occaecat aliquip incididunt mollit magna. Pariatur fugiat esse qui non nulla. Laboris mollit officia enim ex eiusmod nisi minim voluptate ut velit culpa non quis. Non irure est id commodo. Anim Lorem sint id sunt dolor dolore ut veniam irure.\r\nElit occaecat enim ullamco do laboris occaecat consectetur culpa cillum quis. Culpa id commodo voluptate sint amet reprehenderit nulla proident ullamco exercitation incididunt mollit. Ex id adipisicing irure minim consequat ut in labore sunt. Sint in sit do duis. In ut minim pariatur magna eu exercitation dolore nulla ut minim ea labore qui. Esse quis tempor nulla proident sunt velit deserunt deserunt officia ex consequat sit aliquip.\r\n",
                "status": "ACEPTED",
                "trip": "621bc2fcd48b6af286202bd7",
                "actor": "621bc2fc1d2bb77b0faea7dc",
                "__v": 0
            },
            {
                "_id": "621bc2fcbdbc7dec2fa259e1",
                "creationMoment": "2017-05-04T02:25:50.000Z",
                "paid": false,
                "rejectionReason": "Aliquip laborum sunt amet aliqua culpa consectetur in in cillum. Cupidatat labore voluptate irure esse dolor pariatur nulla ullamco labore dolor ea cillum dolore. Consequat id fugiat cillum cupidatat esse Lorem. Velit occaecat laboris id duis qui incididunt pariatur tempor amet cupidatat. Laborum et do exercitation veniam enim exercitation laboris ad incididunt dolore aute nisi amet. Deserunt aliqua dolore minim voluptate.\r\n",
                "comments": "Ea quis officia consequat anim culpa dolor esse culpa sit laboris qui dolor ipsum cillum. In excepteur sint deserunt nostrud cupidatat do ex velit adipisicing. Non ipsum irure qui velit aliquip amet reprehenderit consectetur nulla fugiat ipsum tempor anim officia. Do esse ad ex deserunt incididunt dolor sit nulla anim. Dolor sunt adipisicing laborum cupidatat sit deserunt consectetur Lorem exercitation velit pariatur quis aliquip enim. Est veniam officia in sit ex amet irure aliquip nulla consectetur cillum tempor. Qui non minim elit aute eiusmod esse minim ullamco nulla mollit laborum et nisi sit.\r\nCillum sint id elit pariatur minim. Excepteur id irure dolore non aliqua amet sunt proident labore aliquip sit nostrud ullamco pariatur. Et dolor amet nulla labore eiusmod dolore irure pariatur.\r\nConsectetur laborum cillum incididunt anim. Ex laboris esse adipisicing do eu eu et est veniam magna culpa. Enim esse aute qui pariatur nulla elit aliqua sint Lorem laborum. Pariatur pariatur enim irure aliquip fugiat dolor consectetur velit Lorem Lorem sit excepteur dolore. Eiusmod cupidatat laboris ullamco excepteur pariatur eu consequat ea ad officia commodo.\r\nIrure cupidatat sunt eu sint culpa. Sit aliqua pariatur aute aliqua in. Sint velit reprehenderit quis anim sit occaecat.\r\nAdipisicing consectetur laboris dolore id exercitation eiusmod pariatur est elit. Consectetur id Lorem ex labore aliquip reprehenderit nisi in nulla sunt nostrud nulla aliqua dolore. Do tempor ad consequat fugiat nisi eiusmod excepteur irure. Aute consectetur est anim minim amet culpa. Ipsum culpa veniam ea reprehenderit voluptate sunt nostrud labore non et consequat. Pariatur sint id qui exercitation excepteur labore. Commodo deserunt ullamco magna ex magna.\r\n",
                "status": "ACEPTED",
                "trip": "621bc2fcb4e8bfac031a2c2e",
                "actor": "621bc2fcc34ee5fb4bc8a9bb",
                "__v": 0
            },
            {
                "_id": "621bc2fc0aeb12b65418560f",
                "creationMoment": "2019-04-15T05:01:29.000Z",
                "paid": true,
                "rejectionReason": "Sint dolor reprehenderit laborum sunt adipisicing dolore laboris in velit officia irure et nulla aute. Laborum sunt ex laborum mollit eiusmod cillum mollit labore magna nostrud. Commodo aliqua consequat ut esse esse sunt occaecat aute qui ut aute Lorem.\r\n",
                "comments": "Adipisicing et reprehenderit elit laborum et cillum aliquip. Amet do magna laboris mollit ad deserunt ullamco sunt. Elit id eiusmod tempor reprehenderit do eiusmod laboris sit dolor qui.\r\nAmet cupidatat cillum nostrud occaecat minim nisi veniam officia enim fugiat do ullamco in. Ut labore velit nostrud occaecat magna duis consectetur deserunt qui nulla veniam Lorem. Lorem labore ullamco laboris duis eu nostrud in cillum elit in. Cupidatat culpa sint velit sint veniam ex cillum fugiat et velit aliquip fugiat quis eu. Velit cillum aliqua consectetur laborum culpa occaecat laboris reprehenderit irure minim ut est. Fugiat cillum amet ad consequat reprehenderit.\r\nIncididunt deserunt ut consequat dolore esse tempor adipisicing veniam commodo fugiat veniam duis ea. Laborum dolor aliqua ut dolore est aute. Et tempor pariatur minim nulla culpa laborum ut eiusmod elit aliquip do ex elit ad. Consectetur reprehenderit labore incididunt aliqua. Veniam ex anim culpa aute exercitation sunt officia exercitation dolor non qui. Pariatur velit id magna mollit adipisicing sit mollit.\r\nNisi qui aliqua non ea excepteur sit. Irure tempor dolore proident voluptate velit aliquip culpa. Amet voluptate occaecat magna consequat velit officia cillum cupidatat quis culpa ad eu adipisicing. Tempor ad enim consequat cupidatat do occaecat nostrud ea laborum adipisicing.\r\nIrure nostrud excepteur nulla irure dolore voluptate est culpa qui. Excepteur enim cillum fugiat incididunt adipisicing do in labore ex reprehenderit dolore adipisicing nostrud qui. Cillum in in ea sunt sunt velit ipsum tempor excepteur eiusmod commodo excepteur. Quis ullamco cupidatat ea enim. Proident eu anim adipisicing sit duis sunt non tempor officia.\r\n",
                "status": "ACEPTED",
                "trip": "621bc2fc257e6e1a073ec21a",
                "actor": "621bc2fc34e7daf383da481b",
                "__v": 0
            },

        ],
        "PENDING": [
            {
                "_id": "621bc2fc3cd46ae4cfc9b879",
                "creationMoment": "2014-12-12T08:12:12.000Z",
                "paid": true,
                "rejectionReason": "Nostrud ex mollit nulla cillum proident excepteur aliquip aliqua eu culpa aliqua in. Ipsum consequat elit exercitation exercitation excepteur. Quis aute laboris excepteur mollit ex enim fugiat culpa ut. Et esse ipsum nulla eu officia aliqua consequat fugiat voluptate dolor est sit. Nisi nostrud Lorem nisi dolore et fugiat magna irure ullamco nisi.\r\n",
                "comments": "Nulla quis sit eu irure amet commodo ipsum velit irure ea nulla occaecat ex. Aute cupidatat enim minim occaecat minim sint elit reprehenderit et ullamco enim occaecat proident. Mollit pariatur ex id amet proident fugiat minim in quis ut occaecat esse consequat dolor.\r\nMollit voluptate nostrud enim ea duis veniam tempor officia irure velit elit commodo eu consectetur. Lorem dolor cupidatat nostrud ullamco consequat quis elit commodo nulla pariatur sit dolore occaecat. Dolor laborum veniam esse nisi et labore in nisi nisi aliquip nulla eu cillum. Id sunt enim fugiat magna sunt in. Irure laboris cillum sunt elit deserunt mollit ipsum cupidatat id excepteur veniam occaecat. Consectetur pariatur eu cupidatat mollit dolore incididunt proident magna enim ipsum esse duis pariatur sit.\r\nElit nostrud ex eu cillum qui aliqua qui ad excepteur cillum veniam labore. In ullamco consequat Lorem qui esse quis anim quis. Irure minim id deserunt reprehenderit duis reprehenderit non eu nostrud excepteur. Et nostrud ipsum esse consectetur. Cupidatat mollit mollit officia exercitation ad. Est veniam nisi id ad adipisicing ut sit reprehenderit nisi est. Minim ad commodo consectetur consectetur excepteur aute cillum culpa enim sint eiusmod anim sint anim.\r\nCillum eiusmod pariatur cillum fugiat consectetur. Culpa consequat ullamco ut et enim exercitation laboris irure exercitation voluptate enim aute. Esse reprehenderit minim dolor dolore ad ipsum fugiat reprehenderit nulla et aute incididunt pariatur Lorem. Mollit amet ex sit amet et dolore est adipisicing. Do irure ullamco qui do.\r\nDuis fugiat eiusmod nisi nostrud. Pariatur culpa do do proident. Sint amet tempor reprehenderit est cillum mollit aliquip Lorem cupidatat ad commodo qui est. Dolor fugiat aliqua duis sit sunt minim fugiat amet labore. Ex consequat est ad excepteur eiusmod nisi labore adipisicing deserunt anim laboris sunt nostrud.\r\n",
                "status": "PENDING",
                "trip": "621bc2fcb0009eeab95ca217",
                "actor": "621bc2fc591b7d52521846c6",
                "__v": 0
            },
            {
                "_id": "621bc2fc3a93783209e76b5f",
                "creationMoment": "2015-03-19T06:28:34.000Z",
                "paid": true,
                "rejectionReason": "In cupidatat eu pariatur voluptate ipsum laborum consequat adipisicing excepteur irure esse. Sit consectetur quis dolor dolor labore. Ad aute qui laborum culpa dolor proident.\r\n",
                "comments": "Laboris dolor eu magna culpa aliquip sit magna nostrud esse dolor adipisicing occaecat consectetur quis. Adipisicing sit duis labore aliqua laborum adipisicing consequat. Deserunt eu aute commodo quis. Cupidatat adipisicing incididunt consectetur aute sunt sunt sit id magna ad magna.\r\nOccaecat minim eiusmod et fugiat Lorem eu ea. Incididunt mollit eu eiusmod sint sit. Ex aliquip magna deserunt minim aute nostrud occaecat enim occaecat irure cupidatat dolore occaecat. Ullamco ad ex ex proident amet ex qui eiusmod consectetur id deserunt. Lorem officia magna nostrud reprehenderit aute do magna minim nisi officia aliqua. Exercitation consequat sint reprehenderit cupidatat dolore.\r\nVoluptate reprehenderit est minim id occaecat culpa non nisi fugiat tempor qui tempor. Id proident voluptate pariatur aliquip. Consectetur esse sit esse proident eiusmod.\r\nEx minim excepteur id duis elit consequat non. Ea ullamco exercitation deserunt tempor ut et ea deserunt do ullamco anim velit minim. Velit adipisicing deserunt aliqua excepteur duis do sint non occaecat fugiat duis officia. Occaecat irure non deserunt dolore fugiat enim ad. Voluptate nulla dolore anim occaecat cupidatat dolor elit labore id consequat.\r\nNulla aliqua do aliqua esse. Nisi adipisicing ipsum culpa eiusmod aute ullamco culpa anim minim. Laborum labore enim ad esse pariatur deserunt Lorem velit veniam minim tempor nulla ad. Elit et minim ipsum magna eu anim. Lorem consectetur anim voluptate incididunt et reprehenderit excepteur.\r\n",
                "status": "PENDING",
                "trip": "621bc2fc5974556416ee465d",
                "actor": "621bc2fc62e83c3a0973a8b2",
                "__v": 0
            },
        ],
        "REJECTED": [
            {
                "_id": "621bc2fc464ef381089709ca",
                "creationMoment": "2015-02-24T11:42:18.000Z",
                "paid": true,
                "rejectionReason": "Eiusmod nostrud adipisicing aliquip culpa consectetur labore exercitation non. Amet elit Lorem ea cupidatat veniam magna consequat cillum veniam tempor irure. Fugiat nisi labore cupidatat cupidatat amet esse. Esse velit proident ex tempor fugiat dolore sint.\r\n",
                "comments": "Aute ad veniam nulla et ex. Eiusmod nulla Lorem incididunt magna elit esse ex est reprehenderit cupidatat esse tempor. Cupidatat sint reprehenderit nisi esse do est irure ut ea. Ad sunt ut in consectetur cupidatat consectetur do mollit.\r\nDeserunt irure consequat do reprehenderit. Eu magna consectetur enim laboris pariatur cupidatat. Laborum quis sint eiusmod consequat irure sunt laboris exercitation est enim eiusmod culpa do incididunt. Elit aliqua et pariatur consequat commodo mollit et fugiat laboris amet non cupidatat nulla.\r\nLabore excepteur proident incididunt aliquip enim. Nostrud exercitation ullamco eiusmod labore sunt ipsum. Anim reprehenderit consectetur mollit anim minim elit voluptate non commodo. Reprehenderit exercitation minim sit velit laborum aliquip culpa ullamco.\r\nOfficia laborum et id officia magna culpa labore pariatur ea dolore velit excepteur. Proident duis anim sunt pariatur dolore velit voluptate sunt duis exercitation id. Duis nostrud cillum cupidatat magna. Voluptate cupidatat est anim mollit anim nostrud id. Deserunt consequat pariatur sit nulla reprehenderit labore. Aliquip quis ut non aute ullamco ut voluptate magna duis labore exercitation ut.\r\nNisi consequat tempor occaecat exercitation enim sunt elit veniam sit. Occaecat officia cillum ipsum qui cupidatat commodo aute labore. Qui culpa esse reprehenderit adipisicing pariatur sit ex ipsum nulla adipisicing dolor quis tempor cillum. Voluptate eiusmod deserunt eu qui incididunt. Qui commodo ipsum Lorem minim nisi nulla non. Laboris in sit ullamco laborum. Nulla esse sunt aliqua proident cupidatat.\r\n",
                "status": "REJECTED",
                "trip": "621bc2fc7a3ef8d6184278b1",
                "actor": "621bc2fc5775b71473a0faf3",
                "__v": 0
            },
        ]
    }

    afterEach(()=>{
        sandbox.restore();
    })

    describe('Get applications', () =>{

        it('Return list of all applications', (done) => {
            fakeFindApplications = (err, callback) =>{
                callback(null, applications)
            }
    
            authStub = sandbox.stub(Application, 'find').callsFake(fakeFindApplications);

            chai.request(app)
              .get('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.length).to.equals(1);
                done();
            })
        })

        it('Return one applications', (done) => {
            fakeFindApplication = (err, callback) =>{
                callback(null, application)
            }
    
            authStub = sandbox.stub(Application, 'findById').callsFake(fakeFindApplication);

            chai.request(app)
              .get('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("DUE");
                expect(res.body.comments).to.equals("Comentarios de una aplicación");
                done();
            })
        })

        // it('Return list of all applications by actor', done => {
        //     fakeFindApplications = (err, callback) =>{
        //         callback(null, applicationsByActor)
        //     }
    
        //     authStub = sandbox.stub(Application, 'find').callsFake(fakeFindApplications);

        //     chai.request(app)
        //         .get('/v1/actors/621bc2fcc4b04c8afb4931a0/applications')
        //         .end((err, res) => {
        //         expect(res).to.have.status(200);
        //         expect(res.body["ACCEPTED"].length).to.equals(3);
        //         expect(res.body["REJECTED"].length).to.equals(1);
        //         expect(res.body["CANCELLED"].length).to.equals(1);
        //         expect(res.body["PENDING"].length).to.equals(2);
        //         expect(res.body["DUE"].length).to.equals(2);
        //         done();
        //         })
        // })
    
    })

    describe('Create applications', () =>{

        beforeEach(done =>{
            fakeCreateApplication = (err, callback) =>{
                callback(null, application)
            }

            Object.defineProperty(Application.prototype, 'save', {
                value: Application.prototype.save,
                configurable: true,
              });
    
            authStub =  sandbox.stub(Application.prototype, 'save').callsFake(fakeCreateApplication);
            done();
        })

        afterEach(()=>{
            sandbox.restore();
        })    

        // it('Create an application correctly', (done) => {
        //     chai.request(app)
        //       .post('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
        //       .send(application)
        //       .end((err, res) => {
        //         expect(res).to.have.status(200);
        //         expect(res.body.status).to.equals("DUE");
        //         expect(res.body.comments).to.equals("Comentarios de una aplicación");
        //         done();
        //     })
        // })

        it('Error creating application: Trip is not publised', (done) => {
            var unpublishedTrip={};
            Object.assign(unpublishedTrip,trip);
            unpublishedTrip.published=false;
            fakefindByIdTrip = (err, callback) =>{
                callback(null,unpublishedTrip)
            }
    
            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);
            
            chai.request(app)
              .post('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
              .send(application)
              .end((err, res) => {
                expect(res).to.have.status(405);
                expect(res.error.text).to.equals("The trip is not published");
                done();
            })
        })

        it('Error creating application: Trip already started', (done) => {
            var startedTrip={};
            Object.assign(startedTrip,trip);
            startedTrip.startDate= "2020-05-07T01:36:25.000Z";
            fakefindByIdTrip = (err, callback) =>{
                callback(null,startedTrip)
            }
    
            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);
            
            chai.request(app)
              .post('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
              .send(application)
              .end((err, res) => {
                expect(res).to.have.status(405);
                expect(res.error.text).to.equals("The trip you are trying to apply for has already started");
                done();
            })
        })

        it('Error creating application: Trip cancelled', (done) => {
            var cancelledTrip={}
            Object.assign(cancelledTrip,trip);
            cancelledTrip.state= "CANCELLED";
            fakefindByIdTrip = (err, callback) =>{
                callback(null,cancelledTrip)
            }
    
            authStub = sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);
            
            chai.request(app)
              .post('/v1/trips/621bc2fcc4b04c8afb4931a0/applications')
              .send(application)
              .end((err, res) => {
                expect(res).to.have.status(405);
                expect(res.error.text).to.equals("The trip is cancelled");
                done();
            })
        })
        
    })

    describe('Update applications', () =>{
        var applicationToUpdate={}

        beforeEach(done =>{
            Object.assign(applicationToUpdate,trip);
            applicationToUpdate.status="PENDING"

            done();
        })

        afterEach(()=>{
            sandbox.restore();
        })
    

        // it('Reject an application correctly', (done) => {
        //     var applicationUpdated={}
        //     Object.assign(applicationUpdated,application)
            
        //     applicationUpdated.status="REJECTED"
        //     applicationUpdated.rejectionReason="Rejection reason";

        //     fakefindOneApplication = (err, callback) =>{
        //         callback(null, applicationToUpdate)
        //     }

        //     authStub =  sandbox.stub(Application, 'findOne').callsFake(fakefindOneApplication);

        //     fakefindOneAndUpdateApplication = (err, callback) =>{
        //         callback(null, application)
        //     }

        //     sinon.stub(Application, 'findOneAndUpdate').callsFake(fakefindOneAndUpdateApplication);

        //     chai.request(app)
        //       .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
        //       .send(applicationUpdated)
        //       .end((err, res) => {
        //         expect(res).to.have.status(200);
        //         expect(res.body.status).to.equals("DUE");
        //         expect(res.body.comments).to.equals("Comentarios de una aplicación");
        //         done();
        //     })
        // })

        // it('Change status of application correctly', (done) => {
        //     var applicationUpdated={}
        //     Object.assign(applicationUpdated,application)
            
        //     applicationUpdated.status="DUE"

        //     fakefindOneApplication = (err, callback) =>{
        //         callback(null, applicationToUpdate)
        //     }

        //     authStub =  sandbox.stub(Application, 'findOne').callsFake(fakefindOneApplication);

        //     chai.request(app)
        //       .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
        //       .send(applicationUpdated)
        //       .end((err, res) => {
        //         expect(res).to.have.status(200);
        //         expect(res.body.status).to.equals("DUE");
        //         expect(res.body.comments).to.equals("Comentarios de una aplicación");
        //         done();
        //     })
        // })

        it('Error updating application: Can not cancel application', (done) => {
            var applicationUpdated={}
            Object.assign(applicationUpdated,application)
            
            applicationUpdated.status="REJECTED"

            applicationToUpdate.status="DUE"

            fakefindOneApplication = (err, callback) =>{
                callback(null, applicationToUpdate)
            }

            authStub =  sandbox.stub(Application, 'findOne').callsFake(fakefindOneApplication);
            
            chai.request(app)
              .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30')
              .send(applicationUpdated)
              .end((err, res) => {
                expect(res).to.have.status(405);
                expect(res.error.text).to.equals("You can't cancel the application if the status is not PEDING or ACCEPTED");
                done();
            })
        })

        // it('Pay application correctly', (done) => {
        //     var applicationUpdated={}
        //     Object.assign(applicationUpdated,application)
            
        //     applicationUpdated.status="ACEPTED"

        //     fakefindByIdApplication = (err, callback) =>{
        //         callback(null, application)
        //     }

        //     authStub =  sandbox.stub(Application, 'findById').callsFake(fakefindByIdApplication);

        //     fakefindByIdTrip = (err, callback) =>{
        //         callback(null, trip)
        //     }

        //     authStub =  sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

        //     fakefindOneAndUpdateApplication = (err, callback) =>{
        //         callback(null, applicationUpdated)
        //     }

        //     authStub =  sandbox.stub(Application, 'findOneAndUpdate').callsFake(fakefindOneAndUpdateApplication);

        //     var body={price:2628.17}
            
        //     chai.request(app)
        //       .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30/pay')
        //       .send(body)
        //       .end((err, res) => {
        //         expect(res).to.have.status(200);
        //         done();
        //     })
        // })

        it('Error updating application: Pay less than trip price', (done) => {
            var applicationUpdated={}
            Object.assign(applicationUpdated,application)
            
            applicationUpdated.status="ACEPTED"

            fakefindByIdApplication = (err, callback) =>{
                callback(null, application)
            }

            authStub =  sandbox.stub(Application, 'findById').callsFake(fakefindByIdApplication);

            fakefindByIdTrip = (err, callback) =>{
                callback(null, trip)
            }

            authStub =  sandbox.stub(Trip, 'findById').callsFake(fakefindByIdTrip);

            var body={price:10}
            
            chai.request(app)
              .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30/pay')
              .send(body)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equals("Kindly enter the correct price")
                done();
            })
        })

        it('Error updating application: Application is not in status DUE', (done) => {
            var applicationUpdated={}
            Object.assign(applicationUpdated,application)
            
            applicationUpdated.status="ACEPTED"

            var applicationToBeUpdated={}
            Object.assign(applicationToBeUpdated,application)

            applicationToBeUpdated.status="PENDING"

            fakefindByIdApplication = (err, callback) =>{
                callback(null, applicationToBeUpdated)
            }

            authStub =  sandbox.stub(Application, 'findById').callsFake(fakefindByIdApplication);

            var body={price:10}
            
            chai.request(app)
              .put('/v1/trips/621bc2fcc4b04c8afb4931a0/applications/621bc2fc8ed42c1c26274c30/pay')
              .send(body)
              .end((err, res) => {
                expect(res).to.have.status(405);
                expect(res.error.text).to.equals("You can't pay the application if is not in status DUE")
                done();
            })
        })
        
    })
  
  })
  