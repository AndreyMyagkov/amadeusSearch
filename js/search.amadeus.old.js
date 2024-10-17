'.searchWizard'/**
 * Amadeus search
 */

g_rootUrl = '';
// cfmcalendar.js
; (function ($) {

    $.fn.cfmCalendar = function (order, params) {
        order = typeof order !== 'undefined' ? order : "";

        if (typeof order != "string") {
            params = order;
            order = "";
        }

        var calendarWrapper = this;

        if (order == "") {
            $(calendarWrapper).find(".cmsDatePicker__close.icon-close").click(function (event) { hideCalendar(event, calendarWrapper); });
            $(calendarWrapper).find(".cmsDatePicker__button").click(function (event) { hideCalendar(event, calendarWrapper); });


            $(calendarWrapper).find("select.monthSelect").change(function (event) { calendarScroll(event, calendarWrapper); });

            var clickableOnlyOnValid = false;
            if (typeof params != "undefined" && typeof params.clickable != "undefined" && params.clickable == "onlyValid") {
                clickableOnlyOnValid = true;
            }

            var dayClickedHandler = null;
            if (typeof params != "undefined" && typeof params.dayClickedHandler != "undefined") {
                dayClickedHandler = params.dayClickedHandler;
            }

            $(calendarWrapper).find(".cmsDatePicker__day").click(function (event) { dayClick(event, this, calendarWrapper, clickableOnlyOnValid, dayClickedHandler); });
            //$(calendarWrapper).on("click", ".cmsDatePicker__day", function( event ){ dayClick( event, this, calendarWrapper, clickableOnlyOnValid, dayClickedHandler ); } );
        }
        else if (order == "setDate") {
            if (typeof params.day != "undefined" && typeof params.month != "undefined" && typeof params.year != "undefined") {
                setDate(params.day, params.month, params.year, calendarWrapper);
            }
        }
    }



    /*******************************************
       
    *******************************************/
    function showCalendar(event, calendarWrapper) {
        // close all other
        $(".tripInputForm__inputlayer").removeClass('tripInputForm__inputlayer--open');

        // open
        $(calendarWrapper).find('.tripInputForm__inputlayer').addClass('tripInputForm__inputlayer--open');
    }

    /*******************************************
       
    *******************************************/
    function hideCalendar(event, calendarWrapper) {
        $(".tripInputForm__inputlayer").removeClass('tripInputForm__inputlayer--open');
    }

    /*******************************************
       
    *******************************************/
    function toggleCalendar(event, calendarWrapper) {
        if ($(calendarWrapper).find('.tripInputForm__inputlayer').hasClass('tripInputForm__inputlayer--open')) {
            hideCalendar(event, calendarWrapper);
        }
        else {
            showCalendar(event, calendarWrapper);
        }
    }

    /*******************************************
   
    *******************************************/
    function calendarScroll(event, calendarWrapper) {
        var selected = $(calendarWrapper).find("select").val().split("_");
        var selectedMonth = selected[0];
        var selectedYear = selected[1];
        //var type = $(this).data("type");

        $(calendarWrapper).find(".cmsDatePicker__dayFrame").hide();

        $(calendarWrapper).find('.cmsDatePicker__dayFrame[data-month="' + selectedMonth + '"][data-year="' + selectedYear + '"]').show();
    }


    /*******************************************
   
    *******************************************/
    function dayClick(event, dispatcher, calendarWrapper, clickableOnlyOnValid, dayClickedHandler) {
        var day = $(dispatcher).data("day");
        var month = $(dispatcher).data("month");
        var year = $(dispatcher).data("year");

        // debugger;

        // $( calendarWrapper ).find('.cmsDatePicker__dayFrame .cmsDatePicker__day').removeClass('active');
        // $(dispatcher).addClass( "active" );

        if (!clickableOnlyOnValid || $(dispatcher).hasClass("isValid")) {
            setDate(day, month, year, calendarWrapper);

            hideCalendar(null, calendarWrapper);

            if (dayClickedHandler != null) {
                dayClickedHandler(dispatcher);
            }
        }

    }

    /*******************************************
   
    *******************************************/
    function setDate(day, month, year, calendarWrapper) {
        // .cmsDatePicker__dayFrame 
        // .cmsDatePicker__dayFrame 
        day = day.toString();
        month = month.toString();
        /*
                if( day.toString().length == 2 && day.indexOf("0") == 0 )
                {
                    day = day.substring(1);
                }
                if( month.toString().length == 2 && month.indexOf("0") == 0 )
                {
                    month = month.substring(1);
                }
        */
        $(calendarWrapper).find('.cmsDatePicker__day').removeClass('active');
        $(calendarWrapper).find('.cmsDatePicker__day[data-day="' + day + '"][data-month="' + month + '"][data-year="' + year + '"]').addClass('active');

        if (day.toString().length == 1) { day = '0' + day; }
        if (month.toString().length == 1) { month = '0' + month; }

        $(calendarWrapper).find(".tripInputForm__input").html(day + "." + month + "." + year);
        $(calendarWrapper).find("input").val(day + "." + month + "." + year);
    }


}(jQuery));




// freetextsearch.js

(function ($) {
    function FreeTextSearch(selected, settings) {
        this.input = selected;
        this.settings = settings;

        this.textHasChanged = false;
        this.counter = 0;
        this.qryStr = $(selected).val();

        this.input.data("freeTextObj", this);

        this.setEventHandler();
    };

    FreeTextSearch.prototype.setEventHandler = function () {
        var freeTextSearch = this;
        $(this.input).click(function (event) { freeTextSearch.keyAndChangeHandler(event, freeTextSearch); });
        $(this.input).keyup(function (event) { freeTextSearch.keyAndChangeHandler(event, freeTextSearch); });
        $(this.input).change(function (event) { freeTextSearch.keyAndChangeHandler(event, freeTextSearch); });


        setInterval(function () { freeTextSearch.checkIfTextHasChanged(freeTextSearch); }, this.settings.checkPeriode);
    };

    FreeTextSearch.prototype.checkIfTextHasChanged = function (freeTextSearch) {
        if (freeTextSearch.textHasChanged) {
            if (freeTextSearch.counter > 0) {
                --freeTextSearch.counter;
            }
            else {
                freeTextSearch.textHasChanged = false;

                if (freeTextSearch.qryStr != $(freeTextSearch.input).val()) {
                    freeTextSearch.qryStr = $(freeTextSearch.input).val();

                    // fire changed event
                    if (freeTextSearch.settings.textChangedHandler != null) {
                        freeTextSearch.settings.textChangedHandler(freeTextSearch);
                    }
                }
            }
        }
    };

    FreeTextSearch.prototype.keyAndChangeHandler = function (event, freeTextSearch) {

        freeTextSearch.counter = freeTextSearch.settings.numberOfPeriodes;
        freeTextSearch.textHasChanged = true;
    };

    FreeTextSearch.prototype.setInputText = function (newText) {
        this.qryStr = newText;
        $(this.input).val(newText);
    }

    $.fn.freeTextSearch = function (action, options) {
        if (typeof action != "string") {
            options = action;
            action = "init";
        }
        options = typeof options !== 'undefined' ? options : {};

        var defaults = {
            checkPeriode: 100,
            numberOfPeriodes: 2,
            textChangedHandler: null
        }

        var settings = $.extend({}, defaults, options);

        if (action == "init") {
            new FreeTextSearch(this, settings);
        }
        else if (action == "setInputText") {
            var freeTextSearch = $(this).data("freeTextObj");

            if (typeof freeTextSearch != "undefined") {
                freeTextSearch.setInputText(options);
            }
        }

        return this;
    };
}(jQuery));


// searchmask.js
/********* data *** */
let regions = [{
    "id": "10000",
    "name": "Balearen",
    "regions": [{
        "id": "35",
        "name": "Mallorca"
    },
    {
        "id": "32",
        "name": "Ibiza"
    },
    {
        "id": "630",
        "name": "Menorca"
    },
    {
        "id": "627",
        "name": "Formentera"
    }
    ]
},
{
    "id": "10001",
    "name": "Kanaren",
    "regions": [{
        "id": "59",
        "name": "El Hierro"
    },
    {
        "id": "676",
        "name": "Lanzarote"
    },
    {
        "id": "56",
        "name": "Teneriffa"
    },
    {
        "id": "345",
        "name": "Gran Canaria"
    },
    {
        "id": "832",
        "name": "Fuerteventura"
    },
    {
        "id": "675",
        "name": "La Palma"
    },
    {
        "id": "50",
        "name": "La Gomera"
    }
    ]
},
{
    "id": "10002",
    "name": "Portugal",
    "regions": [{
        "id": "664",
        "name": "Azoren"
    },
    {
        "id": "695",
        "name": "Costa do Estoril (Lissabon)"
    },
    {
        "id": "637",
        "name": "Faro & Algarve"
    },
    {
        "id": "2660",
        "name": "Braga / Vila Real / Viano do Castelo / Braganca"
    },
    {
        "id": "339",
        "name": "Alentejo - Beja / Setubal / Evora / Santarem / Portalegre"
    },
    {
        "id": "457",
        "name": "Costa de Prata (Leira / Coimbra / Aveiro)"
    },
    {
        "id": "639",
        "name": "Madeira"
    },
    {
        "id": "467",
        "name": "Porto"
    },
    {
        "id": "2659",
        "name": "Aveiro / Guarda / Viseu"
    },
    {
        "id": "338",
        "name": "Coimbra / Leiria / Castelo Branco"
    },
    {
        "id": "674",
        "name": "Lissabon & Umgebung"
    },
    {
        "id": "494",
        "name": "Costa Verde (Braga / Viana do Castelo)"
    },
    {
        "id": "636",
        "name": "Costa da Caparica (Setúbal)"
    },
    {
        "id": "2658",
        "name": "Costa Azul (Setubal / Beja)"
    },
    {
        "id": "667",
        "name": "Pico (Azoren)"
    },
    {
        "id": "2662",
        "name": "Porto Santo"
    }
    ]
},
{
    "id": "10003",
    "name": "Spanisches Festland",
    "regions": [{
        "id": "2054",
        "name": "Costa Dorada"
    },
    {
        "id": "229",
        "name": "Andalusien Inland"
    },
    {
        "id": "61",
        "name": "Costa de la Luz"
    },
    {
        "id": "156",
        "name": "Andorra"
    },
    {
        "id": "62",
        "name": "Costa del Sol & Costa Tropical"
    },
    {
        "id": "931",
        "name": "Costa Barcelona"
    },
    {
        "id": "793",
        "name": "Zentral Spanien"
    },
    {
        "id": "2661",
        "name": "Provinz Murcia Inland"
    },
    {
        "id": "505",
        "name": "Nordspanien - Atlantikküste"
    },
    {
        "id": "65",
        "name": "Spanien Nordosten & Pyrenäen"
    },
    {
        "id": "2014",
        "name": "Costa Azahar"
    },
    {
        "id": "64",
        "name": "Costa Blanca & Costa Calida"
    },
    {
        "id": "2068",
        "name": "Barcelona & Umgebung"
    },
    {
        "id": "794",
        "name": "Madrid & Umgebung"
    },
    {
        "id": "2013",
        "name": "Costa Brava"
    },
    {
        "id": "63",
        "name": "Golf von Almeria"
    },
    {
        "id": "4204",
        "name": "Melilla"
    },
    {
        "id": "4185",
        "name": "Gibraltar"
    },
    {
        "id": "4203",
        "name": "Ceuta"
    },
    {
        "id": "4202",
        "name": "Provinz Valencia Inland"
    }
    ]
},
{
    "id": "10004",
    "name": "Türkei",
    "regions": [{
        "id": "373",
        "name": "Istanbul & Umgebung"
    },
    {
        "id": "644",
        "name": "Kemer & Beldibi"
    },
    {
        "id": "643",
        "name": "Side & Alanya"
    },
    {
        "id": "647",
        "name": "Marmaris & Icmeler & Datca"
    },
    {
        "id": "434",
        "name": "Antalya & Belek"
    },
    {
        "id": "646",
        "name": "Dalyan - Dalaman - Fethiye - Ölüdeniz - Kas"
    },
    {
        "id": "526",
        "name": "Türkei Inland"
    },
    {
        "id": "648",
        "name": "Bodrum"
    },
    {
        "id": "651",
        "name": "Kusadasi & Didyma"
    },
    {
        "id": "2511",
        "name": "Schwarzmeerküste Türkei"
    },
    {
        "id": "652",
        "name": "Ayvalik, Cesme & Izmir"
    },
    {
        "id": "542",
        "name": "Mersin - Adana - Antakya"
    }
    ]
},
{
    "id": "10005",
    "name": "Griechische Inseln",
    "regions": [{
        "id": "6",
        "name": "Korfu & Paxi"
    },
    {
        "id": "655",
        "name": "Rhodos"
    },
    {
        "id": "616",
        "name": "Kreta"
    },
    {
        "id": "403",
        "name": "Kalymnos & Telendos"
    },
    {
        "id": "392",
        "name": "Paros, Kimolos, Milos, Serifos, Sifnos"
    },
    {
        "id": "396",
        "name": "Kefalonia & Ithaki"
    },
    {
        "id": "383",
        "name": "Euböa (Evia)"
    },
    {
        "id": "13",
        "name": "Skiathos, Skopelos & Skyros"
    },
    {
        "id": "9",
        "name": "Mykonos"
    },
    {
        "id": "395",
        "name": "Lefkas & Meganissi"
    },
    {
        "id": "552",
        "name": "Ios & Sikinos"
    },
    {
        "id": "14",
        "name": "Zakynthos"
    },
    {
        "id": "7",
        "name": "Kos"
    },
    {
        "id": "12",
        "name": "Santorin"
    },
    {
        "id": "554",
        "name": "Tilos & Chalki"
    },
    {
        "id": "8",
        "name": "Lesbos & Lemnos & Samothraki"
    },
    {
        "id": "11",
        "name": "Samos"
    },
    {
        "id": "16",
        "name": "Thassos"
    },
    {
        "id": "558",
        "name": "Aegina & Angistri & Salamina"
    },
    {
        "id": "390",
        "name": "Syros & Kea & Kithnos"
    },
    {
        "id": "387",
        "name": "Alonissos"
    },
    {
        "id": "393",
        "name": "Naxos"
    },
    {
        "id": "391",
        "name": "Andros"
    },
    {
        "id": "404",
        "name": "Symi"
    },
    {
        "id": "399",
        "name": "Ikaria"
    },
    {
        "id": "389",
        "name": "Tinos"
    },
    {
        "id": "535",
        "name": "Hydra, Spetses"
    },
    {
        "id": "549",
        "name": "Amorgos & Astypalaia"
    },
    {
        "id": "491",
        "name": "Folegandros"
    },
    {
        "id": "15",
        "name": "Karpathos & Kasos"
    },
    {
        "id": "401",
        "name": "Patmos"
    },
    {
        "id": "546",
        "name": "Poros"
    },
    {
        "id": "402",
        "name": "Leros"
    },
    {
        "id": "547",
        "name": "Antiparos"
    }
    ]
},
{
    "id": "10006",
    "name": "Griechenland Festland",
    "regions": [{
        "id": "734",
        "name": "Pilion"
    },
    {
        "id": "382",
        "name": "Peloponnes"
    },
    {
        "id": "534",
        "name": "Chalkidiki"
    },
    {
        "id": "625",
        "name": "Thessaloniki"
    },
    {
        "id": "4103",
        "name": "Thessalien & Mittelgriechenland"
    },
    {
        "id": "4104",
        "name": "Makedonien"
    },
    {
        "id": "733",
        "name": "Olympische Riviera"
    },
    {
        "id": "553",
        "name": "Epirus & Westgriechenland"
    },
    {
        "id": "277",
        "name": "Thrakien"
    },
    {
        "id": "18",
        "name": "Athen & Umgebung"
    }
    ]
},
{
    "id": "10007",
    "name": "Italien, Malta",
    "regions": [{
        "id": "77",
        "name": "Sizilien"
    },
    {
        "id": "536",
        "name": "Kalabrien"
    },
    {
        "id": "595",
        "name": "Malta"
    },
    {
        "id": "78",
        "name": "Sardinien"
    },
    {
        "id": "844",
        "name": "Trentino & Südtirol"
    },
    {
        "id": "291",
        "name": "Basilikata"
    },
    {
        "id": "464",
        "name": "Apulien"
    },
    {
        "id": "2048",
        "name": "Gardasee"
    },
    {
        "id": "537",
        "name": "Toskana"
    },
    {
        "id": "76",
        "name": "Neapel & Umgebung"
    },
    {
        "id": "560",
        "name": "Rom & Umgebung"
    },
    {
        "id": "3005",
        "name": "Latium"
    },
    {
        "id": "82",
        "name": "Venetien"
    },
    {
        "id": "81",
        "name": "Emilia Romagna"
    },
    {
        "id": "75",
        "name": "Ischia"
    },
    {
        "id": "297",
        "name": "Friaul - Julisch Venetien"
    },
    {
        "id": "2012",
        "name": "Oberitalienische Seen"
    },
    {
        "id": "845",
        "name": "Aostatal & Piemont & Lombardei"
    },
    {
        "id": "296",
        "name": "Marken"
    },
    {
        "id": "80",
        "name": "Elba"
    },
    {
        "id": "818",
        "name": "Ligurien"
    },
    {
        "id": "817",
        "name": "Umbrien"
    },
    {
        "id": "891",
        "name": "Abruzzen"
    },
    {
        "id": "295",
        "name": "Molise"
    },
    {
        "id": "79",
        "name": "Capri"
    }
    ]
},
{
    "id": "10008",
    "name": "Tunesien, Marokko",
    "regions": [{
        "id": "131",
        "name": "Tunesien - Norden"
    },
    {
        "id": "705",
        "name": "Marokko - Inland"
    },
    {
        "id": "136",
        "name": "Tunesien - Inland & Gabès & Sfax"
    },
    {
        "id": "132",
        "name": "Tunesien - Hammamet"
    },
    {
        "id": "614",
        "name": "Tunesien - Monastir"
    },
    {
        "id": "4200",
        "name": "Marokko - Atlantikküste: Casablanca / El Jadida / Rabat"
    },
    {
        "id": "482",
        "name": "Marokko - Tanger & Mittelmeerküste"
    },
    {
        "id": "125",
        "name": "Marokko - Atlantikküste: Agadir / Safi / Tiznit"
    },
    {
        "id": "133",
        "name": "Tunesien - Insel Djerba"
    },
    {
        "id": "126",
        "name": "Marokko - Marrakesch"
    },
    {
        "id": "135",
        "name": "Tunesien - Oase Zarzis"
    }
    ]
},
{
    "id": "10010",
    "name": "Ägypten",
    "regions": [{
        "id": "350",
        "name": "Hurghada & Safaga"
    },
    {
        "id": "351",
        "name": "Sharm el Sheikh / Nuweiba / Taba"
    },
    {
        "id": "330",
        "name": "Marsa Alam & Quseir"
    },
    {
        "id": "348",
        "name": "Kairo & Gizeh & Memphis & Ismailia"
    },
    {
        "id": "2500",
        "name": "weitere Angebote Ägypten"
    },
    {
        "id": "349",
        "name": "Luxor & Assuan"
    }
    ]
},
{
    "id": "10011",
    "name": "Afrika",
    "regions": [{
        "id": "4109",
        "name": "Südafrika: Eastern Cape (Port Elizabeth)"
    },
    {
        "id": "454",
        "name": "Tansania - Sansibar"
    },
    {
        "id": "873",
        "name": "Südafrika: Western Cape (Kapstadt)"
    },
    {
        "id": "137",
        "name": "Gambia"
    },
    {
        "id": "453",
        "name": "Namibia"
    },
    {
        "id": "359",
        "name": "Kenia - Südküste"
    },
    {
        "id": "586",
        "name": "Kap Verde - Santiago"
    },
    {
        "id": "883",
        "name": "Südafrika: Gauteng (Johannesburg)"
    },
    {
        "id": "280",
        "name": "Kap Verde - Boavista"
    },
    {
        "id": "358",
        "name": "Kenia - Nordküste"
    },
    {
        "id": "174",
        "name": "Kenia - Nairobi & Inland"
    },
    {
        "id": "585",
        "name": "Kap Verde - Sal"
    },
    {
        "id": "876",
        "name": "Südafrika: Northwest (Mahikeng)"
    },
    {
        "id": "161",
        "name": "Madagaskar"
    }
    ]
},
{
    "id": "10012",
    "name": "Kuba",
    "regions": [{
        "id": "369",
        "name": "Kuba - Havanna / Varadero / Mayabeque / Artemisa / P. del Rio"
    },
    {
        "id": "371",
        "name": "Kuba - Holguin / S. de Cuba / Granma / Las Tunas / Guantanamo"
    },
    {
        "id": "3009",
        "name": "Kuba - Santa Clara / Cienfuegos / S. Spiritus / Camagüey"
    },
    {
        "id": "3011",
        "name": "Kuba - Cayo Coco"
    },
    {
        "id": "3010",
        "name": "Kuba - Isla de la Juventud / Cayo Largo del Sur"
    }
    ]
},
{
    "id": "10013",
    "name": "Dom. Republik",
    "regions": [{
        "id": "366",
        "name": "Dom. Republik - Norden (Puerto Plata & Samana)"
    },
    {
        "id": "367",
        "name": "Dom. Republik - Osten (Punta Cana)"
    },
    {
        "id": "368",
        "name": "Dom. Republik - Süden (Santo Domingo)"
    }
    ]
},
{
    "id": "10014",
    "name": "Karibik",
    "regions": [{
        "id": "582",
        "name": "Curacao"
    },
    {
        "id": "4197",
        "name": "Aruba"
    },
    {
        "id": "571",
        "name": "Martinique"
    },
    {
        "id": "4110",
        "name": "Bonaire, Sint Eustatius & Saba"
    },
    {
        "id": "572",
        "name": "Guadeloupe"
    },
    {
        "id": "4098",
        "name": "Saint-Martin (frz.)"
    },
    {
        "id": "245",
        "name": "Barbados"
    },
    {
        "id": "566",
        "name": "Bahamas"
    },
    {
        "id": "247",
        "name": "Jamaika"
    },
    {
        "id": "378",
        "name": "Tobago"
    },
    {
        "id": "4198",
        "name": "Sint Maarten (nl.)"
    },
    {
        "id": "377",
        "name": "Grenada"
    }
    ]
},
{
    "id": "10015",
    "name": "USA",
    "regions": [{
        "id": "688",
        "name": "Kalifornien"
    },
    {
        "id": "760",
        "name": "Oregon"
    },
    {
        "id": "759",
        "name": "Illinois & Wisconsin"
    },
    {
        "id": "752",
        "name": "Utah"
    },
    {
        "id": "522",
        "name": "Florida Westküste"
    },
    {
        "id": "524",
        "name": "Florida Orlando & Inland"
    },
    {
        "id": "521",
        "name": "Florida Ostküste"
    },
    {
        "id": "886",
        "name": "New England"
    },
    {
        "id": "484",
        "name": "Arizona"
    },
    {
        "id": "755",
        "name": "Texas"
    },
    {
        "id": "428",
        "name": "Hawaii - Insel Maui"
    },
    {
        "id": "697",
        "name": "New York"
    },
    {
        "id": "523",
        "name": "Florida Südspitze"
    },
    {
        "id": "694",
        "name": "Kalifornien: Sierra Nevada"
    },
    {
        "id": "769",
        "name": "Montana"
    },
    {
        "id": "431",
        "name": "Hawaii - Insel Kauai"
    },
    {
        "id": "782",
        "name": "New Jersey & Delaware"
    },
    {
        "id": "753",
        "name": "Colorado"
    },
    {
        "id": "427",
        "name": "Hawaii - Insel Big Island"
    },
    {
        "id": "761",
        "name": "Washington"
    },
    {
        "id": "692",
        "name": "Nevada"
    },
    {
        "id": "430",
        "name": "Hawaii - Insel Oahu"
    },
    {
        "id": "763",
        "name": "Washington D.C. & Maryland"
    },
    {
        "id": "758",
        "name": "Pennsylvania"
    },
    {
        "id": "778",
        "name": "Minnesota & Iowa"
    }
    ]
},
{
    "id": "10016",
    "name": "Mexiko",
    "regions": [{
        "id": "282",
        "name": "Mexiko: Yucatan / Cancun"
    },
    {
        "id": "541",
        "name": "Mexiko Stadt"
    },
    {
        "id": "704",
        "name": "Mexiko: Pazifikküste"
    }
    ]
},
{
    "id": "10017",
    "name": "Asien",
    "regions": [{
        "id": "448",
        "name": "Vietnam"
    },
    {
        "id": "361",
        "name": "Sri Lanka"
    },
    {
        "id": "311",
        "name": "Indonesien: Bali"
    },
    {
        "id": "473",
        "name": "Singapur"
    },
    {
        "id": "528",
        "name": "Indonesien: Kl. Sundainseln-Lombok/Gili/Moyo/Flores/Sumba/Timor"
    },
    {
        "id": "474",
        "name": "Hongkong & Kowloon & Hongkong Island"
    },
    {
        "id": "360",
        "name": "Indien: Goa"
    },
    {
        "id": "425",
        "name": "Malaysia"
    },
    {
        "id": "469",
        "name": "Japan: Tokio, Osaka, Hiroshima, Japan. Inseln"
    },
    {
        "id": "197",
        "name": "Indien: Karnataka / Kerala / A. Pradesh / T. Nadu / Lakkadiven"
    },
    {
        "id": "2652",
        "name": "China - Sichuan / Yunnan / Guangxi / Guizhou / Chongqing"
    },
    {
        "id": "871",
        "name": "Indonesien: Bintan & Batam"
    },
    {
        "id": "2653",
        "name": "China - Hainan / Guangdong / Hunan / Jiangxi"
    },
    {
        "id": "843",
        "name": "Kambodscha"
    }
    ]
},
{
    "id": "10019",
    "name": "Zypern",
    "regions": [{
        "id": "620",
        "name": "Republik Zypern - Süden"
    },
    {
        "id": "99",
        "name": "Nordzypern"
    }
    ]
},
{
    "id": "10020",
    "name": "Dubai, Arabische Halbinsel",
    "regions": [{
        "id": "532",
        "name": "Oman"
    },
    {
        "id": "353",
        "name": "Dubai"
    },
    {
        "id": "725",
        "name": "Umm Al Quwain"
    },
    {
        "id": "724",
        "name": "Ajman"
    },
    {
        "id": "722",
        "name": "Fujairah"
    },
    {
        "id": "723",
        "name": "Ras Al-Khaimah"
    },
    {
        "id": "352",
        "name": "Sharjah / Khorfakkan"
    },
    {
        "id": "354",
        "name": "Abu Dhabi"
    },
    {
        "id": "721",
        "name": "Bahrain"
    },
    {
        "id": "884",
        "name": "Al Ain"
    },
    {
        "id": "720",
        "name": "Katar"
    }
    ]
},
{
    "id": "10021",
    "name": "Frankreich",
    "regions": [{
        "id": "23",
        "name": "Korsika"
    },
    {
        "id": "2055",
        "name": "Côte d'Azur"
    },
    {
        "id": "495",
        "name": "Paris & Umgebung"
    },
    {
        "id": "2042",
        "name": "Rhone Alpes"
    },
    {
        "id": "4127",
        "name": "Midi Pyrenees"
    },
    {
        "id": "24",
        "name": "Mittelmeerküste"
    },
    {
        "id": "2041",
        "name": "Disneyland Paris"
    },
    {
        "id": "2040",
        "name": "Bretagne"
    },
    {
        "id": "4188",
        "name": "Pays de la Loire"
    },
    {
        "id": "25",
        "name": "Aquitanien"
    },
    {
        "id": "2057",
        "name": "Languedoc Roussillon"
    },
    {
        "id": "880",
        "name": "Monaco"
    },
    {
        "id": "4189",
        "name": "Poitou-Charentes"
    },
    {
        "id": "1023",
        "name": "Normandie & Picardie & Nord-Pas-de-Calais"
    },
    {
        "id": "2056",
        "name": "Provence-Alpes-Côte d'Azur"
    }
    ]
},
{
    "id": "10022",
    "name": "Nordeuropa",
    "regions": [{
        "id": "813",
        "name": "Norwegen"
    },
    {
        "id": "902",
        "name": "Dänemark"
    },
    {
        "id": "851",
        "name": "Schweden"
    },
    {
        "id": "449",
        "name": "Island"
    },
    {
        "id": "490",
        "name": "Finnland"
    }
    ]
},
{
    "id": "10023",
    "name": "Südamerika",
    "regions": [{
        "id": "787",
        "name": "Peru"
    },
    {
        "id": "375",
        "name": "Brasilien: Rio de Janeiro & Umgebung"
    },
    {
        "id": "783",
        "name": "Ecuador"
    },
    {
        "id": "4167",
        "name": "Brasilien: Bahia (Salvador da Bahia)"
    },
    {
        "id": "376",
        "name": "Kolumbien"
    },
    {
        "id": "450",
        "name": "Argentinien"
    },
    {
        "id": "4170",
        "name": "Brasilien: Ceara (Fortaleza)"
    },
    {
        "id": "784",
        "name": "Chile"
    },
    {
        "id": "785",
        "name": "Uruguay"
    },
    {
        "id": "4168",
        "name": "Brasilien: Sao Paulo"
    },
    {
        "id": "374",
        "name": "Brasilien: Pernambuco (Recife)"
    },
    {
        "id": "4171",
        "name": "Brasilien: Amazonas (Manaus)"
    },
    {
        "id": "788",
        "name": "Bolivien"
    }
    ]
},
{
    "id": "10024",
    "name": "Kanada",
    "regions": [{
        "id": "767",
        "name": "Kanada: Alberta"
    },
    {
        "id": "766",
        "name": "Kanada: Ontario"
    },
    {
        "id": "765",
        "name": "Kanada: Quebec"
    },
    {
        "id": "768",
        "name": "Kanada: British Columbia"
    },
    {
        "id": "791",
        "name": "Kanada: Saskatchewan"
    }
    ]
},
{
    "id": "10026",
    "name": "Naher Osten",
    "regions": [{
        "id": "515",
        "name": "Jordanien"
    },
    {
        "id": "727",
        "name": "Israel - Totes Meer"
    },
    {
        "id": "509",
        "name": "Israel - Jerusalem & Umgebung"
    },
    {
        "id": "225",
        "name": "Israel - Eilat"
    },
    {
        "id": "510",
        "name": "Israel - Tel Aviv & Umgebung"
    }
    ]
},
{
    "id": "10027",
    "name": "Thailand",
    "regions": [{
        "id": "846",
        "name": "Thailand: Khao Lak & Umgebung"
    },
    {
        "id": "323",
        "name": "Thailand: Inseln im Golf (Koh Chang, Koh Phangan)"
    },
    {
        "id": "4133",
        "name": "Thailand: Krabi & Umgebung"
    },
    {
        "id": "322",
        "name": "Thailand: Insel Phuket"
    },
    {
        "id": "325",
        "name": "Thailand: Insel Koh Samui"
    },
    {
        "id": "4129",
        "name": "Thailand: Nordosten (Issan)"
    },
    {
        "id": "321",
        "name": "Thailand: Bangkok & Umgebung"
    },
    {
        "id": "4131",
        "name": "Thailand: Südosten (Pattaya, Jomtien)"
    },
    {
        "id": "327",
        "name": "Thailand: Inseln Andaman See (Koh Pee Pee, Koh Lanta)"
    },
    {
        "id": "4130",
        "name": "Thailand: Westen (Hua Hin, Cha Am, River Kwai)"
    },
    {
        "id": "4128",
        "name": "Thailand: Norden (Chiang Mai, Chiang Rai, Sukhothai)"
    }
    ]
},
{
    "id": "10028",
    "name": "Mitteleuropa",
    "regions": [{
        "id": "806",
        "name": "Vorarlberg"
    },
    {
        "id": "503",
        "name": "Irland"
    },
    {
        "id": "956",
        "name": "Tirol - Innsbruck, Mittel- und Nordtirol"
    },
    {
        "id": "178",
        "name": "London & Südengland"
    },
    {
        "id": "920",
        "name": "Graubünden"
    },
    {
        "id": "2009",
        "name": "Tirol - Westtirol & Ötztal"
    },
    {
        "id": "958",
        "name": "Wien & Umgebung"
    },
    {
        "id": "913",
        "name": "Appenzell"
    },
    {
        "id": "179",
        "name": "Mittel- & Nordengland"
    },
    {
        "id": "854",
        "name": "Niederlande"
    },
    {
        "id": "2007",
        "name": "Salzburg - Salzburger Land"
    },
    {
        "id": "951",
        "name": "Kärnten"
    },
    {
        "id": "922",
        "name": "Luzern & Aargau"
    },
    {
        "id": "2006",
        "name": "Salzkammergut - Oberösterreich / Steiermark / Salzburg"
    },
    {
        "id": "918",
        "name": "Genf"
    },
    {
        "id": "950",
        "name": "Burgenland"
    },
    {
        "id": "936",
        "name": "Zürich"
    },
    {
        "id": "2004",
        "name": "Tirol - Zillertal"
    },
    {
        "id": "952",
        "name": "Niederösterreich"
    },
    {
        "id": "953",
        "name": "Oberösterreich"
    },
    {
        "id": "855",
        "name": "Belgien"
    },
    {
        "id": "932",
        "name": "Uri & Glarus"
    },
    {
        "id": "901",
        "name": "Schottland"
    },
    {
        "id": "962",
        "name": "Jersey - Kanalinsel"
    },
    {
        "id": "856",
        "name": "Luxemburg"
    },
    {
        "id": "905",
        "name": "Nordirland"
    },
    {
        "id": "2018",
        "name": "Tirol - Osttirol"
    },
    {
        "id": "2005",
        "name": "Tirol - Stubaital"
    },
    {
        "id": "1003",
        "name": "Tirol - Paznaun"
    },
    {
        "id": "955",
        "name": "Steiermark"
    },
    {
        "id": "928",
        "name": "Schwyz"
    },
    {
        "id": "930",
        "name": "Tessin"
    },
    {
        "id": "2001",
        "name": "Tirol - Region Seefeld"
    },
    {
        "id": "954",
        "name": "Salzburg - Salzburg"
    },
    {
        "id": "926",
        "name": "St.Gallen & Thurgau"
    },
    {
        "id": "933",
        "name": "Waadt & Jura & Neuenburg"
    },
    {
        "id": "915",
        "name": "Basel & Solothurn"
    },
    {
        "id": "4191",
        "name": "Bodensee (Schweiz)"
    }
    ]
},
{
    "id": "10029",
    "name": "Deutschland",
    "regions": [{
        "id": "2034",
        "name": "Mecklenburgische Seenplatte"
    },
    {
        "id": "2025",
        "name": "Bayerischer Wald"
    },
    {
        "id": "2033",
        "name": "Insel Usedom"
    },
    {
        "id": "116",
        "name": "Niedersachsen"
    },
    {
        "id": "2051",
        "name": "Elbsandsteingebirge"
    },
    {
        "id": "2002",
        "name": "Schwarzwald"
    },
    {
        "id": "264",
        "name": "München"
    },
    {
        "id": "104",
        "name": "Baden-Württemberg"
    },
    {
        "id": "2061",
        "name": "Hunsrück / Taunus"
    },
    {
        "id": "2035",
        "name": "Mecklenburg Ostseeküste"
    },
    {
        "id": "2026",
        "name": "Allgäu"
    },
    {
        "id": "2058",
        "name": "Bayerische Alpen"
    },
    {
        "id": "2024",
        "name": "Lüneburger Heide"
    },
    {
        "id": "121",
        "name": "Sachsen"
    },
    {
        "id": "2028",
        "name": "Bodensee (Deutschland)"
    },
    {
        "id": "114",
        "name": "Hessen"
    },
    {
        "id": "2050",
        "name": "Erzgebirge"
    },
    {
        "id": "2008",
        "name": "Oberbayern"
    },
    {
        "id": "2039",
        "name": "Ostseeküste"
    },
    {
        "id": "107",
        "name": "Brandenburg"
    },
    {
        "id": "2066",
        "name": "Schwäbische Alb"
    },
    {
        "id": "2060",
        "name": "Franken"
    },
    {
        "id": "2032",
        "name": "Insel Rügen"
    },
    {
        "id": "4196",
        "name": "Bayerisch-Schwaben"
    },
    {
        "id": "106",
        "name": "Berlin"
    },
    {
        "id": "117",
        "name": "Nordrhein-Westfalen"
    },
    {
        "id": "115",
        "name": "Mecklenburg-Vorpommern"
    },
    {
        "id": "4102",
        "name": "Schleswig-Holstein"
    },
    {
        "id": "2063",
        "name": "Niederbayern"
    },
    {
        "id": "2036",
        "name": "Nordseeküste und Inseln - sonstige Angebote"
    },
    {
        "id": "2069",
        "name": "Berchtesgadener Land"
    },
    {
        "id": "123",
        "name": "Sachsen-Anhalt"
    },
    {
        "id": "127",
        "name": "Nordfriesland & Inseln"
    },
    {
        "id": "4111",
        "name": "Hochschwarzwald"
    },
    {
        "id": "2059",
        "name": "Ruhrgebiet"
    },
    {
        "id": "2030",
        "name": "Fichtelgebirge"
    },
    {
        "id": "2019",
        "name": "Düsseldorf & Umgebung"
    },
    {
        "id": "2020",
        "name": "Köln & Umgebung"
    },
    {
        "id": "2071",
        "name": "Lausitz"
    },
    {
        "id": "2021",
        "name": "Teutoburger Wald"
    },
    {
        "id": "105",
        "name": "Oberpfalz"
    },
    {
        "id": "113",
        "name": "Hamburg"
    },
    {
        "id": "112",
        "name": "Bremen"
    },
    {
        "id": "2667",
        "name": "Oberschwaben"
    },
    {
        "id": "2038",
        "name": "Sauerland"
    },
    {
        "id": "2031",
        "name": "Harz"
    }
    ]
},
{
    "id": "10030",
    "name": "Kroatien, Bulgarien, Osteuropa",
    "regions": [{
        "id": "850",
        "name": "Slowakei"
    },
    {
        "id": "2011",
        "name": "Kroatien: Norddalmatien"
    },
    {
        "id": "102",
        "name": "Bulgarien: Sonnenstrand / Burgas / Nessebar"
    },
    {
        "id": "501",
        "name": "Kroatien: Insel Brac"
    },
    {
        "id": "504",
        "name": "Kroatische Inseln"
    },
    {
        "id": "455",
        "name": "Montenegro"
    },
    {
        "id": "2016",
        "name": "Ungarn: Plattensee / Balaton"
    },
    {
        "id": "635",
        "name": "Kroatien: Süddalmatien"
    },
    {
        "id": "316",
        "name": "Litauen"
    },
    {
        "id": "849",
        "name": "Ungarn"
    },
    {
        "id": "852",
        "name": "Polen"
    },
    {
        "id": "483",
        "name": "Kroatien: Istrien"
    },
    {
        "id": "877",
        "name": "Kroatien: Mitteldalmatien"
    },
    {
        "id": "301",
        "name": "Kroatien: Mittelkroatien"
    },
    {
        "id": "838",
        "name": "Estland"
    },
    {
        "id": "628",
        "name": "slowenische Adria"
    },
    {
        "id": "853",
        "name": "Tschechien"
    },
    {
        "id": "497",
        "name": "Slowenien Inland"
    },
    {
        "id": "110",
        "name": "Rumänien"
    },
    {
        "id": "2579",
        "name": "Serbien"
    },
    {
        "id": "103",
        "name": "Bulgarien: Goldstrand / Varna"
    },
    {
        "id": "480",
        "name": "Kroatien: Kvarner Bucht"
    },
    {
        "id": "836",
        "name": "Lettland"
    },
    {
        "id": "1027",
        "name": "Bulgarien: Albena & Umgebung"
    },
    {
        "id": "4107",
        "name": "Albanien"
    },
    {
        "id": "539",
        "name": "Bulgarien (Landesinnere)"
    },
    {
        "id": "751",
        "name": "Ukraine & Krim"
    },
    {
        "id": "507",
        "name": "Kroatien: Insel Krk"
    },
    {
        "id": "910",
        "name": "Bosnien-Herzegowina"
    },
    {
        "id": "500",
        "name": "Kroatien: Insel Hvar"
    },
    {
        "id": "837",
        "name": "Georgien"
    },
    {
        "id": "821",
        "name": "Russland - Sankt Petersburg & Nordwesten (Murmansk)"
    }
    ]
},
{
    "id": "10032",
    "name": "Glückshotels",
    "regions": [{
        "id": "2142",
        "name": "Glückshotel Dubai & Arabische Halbinsel"
    },
    {
        "id": "2112",
        "name": "Glückshotel Griechenland"
    },
    {
        "id": "2113",
        "name": "Glückshotel Kreta"
    },
    {
        "id": "2126",
        "name": "Glückshotel Sardinien"
    },
    {
        "id": "4002",
        "name": "Glückshotel Ägypten"
    }
    ]
},
{
    "id": "10033",
    "name": "Rundreisen",
    "regions": [{
        "id": "2231",
        "name": "Rundreise Kroatien"
    },
    {
        "id": "2278",
        "name": "Rundreise Sardinien"
    },
    {
        "id": "2513",
        "name": "Rundreise Italien"
    },
    {
        "id": "2541",
        "name": "Rundreise Namibia"
    },
    {
        "id": "388",
        "name": "Rundreise Kykladen und Inselhüpfen"
    },
    {
        "id": "2253",
        "name": "Rundreise Andalusien"
    },
    {
        "id": "2549",
        "name": "Rundreise Tansania"
    },
    {
        "id": "991",
        "name": "Rundreise Montenegro"
    },
    {
        "id": "2234",
        "name": "Rundreise Kuba"
    },
    {
        "id": "2244",
        "name": "Rundreise Madeira"
    },
    {
        "id": "43",
        "name": "Rundreise Seychellen"
    },
    {
        "id": "4015",
        "name": "Rundreise Rumänien"
    },
    {
        "id": "4001",
        "name": "Rundreise Norwegen"
    },
    {
        "id": "2560",
        "name": "Rundreise USA & Alaska"
    },
    {
        "id": "40",
        "name": "Rundreise Armenien"
    },
    {
        "id": "33",
        "name": "Rundreise Panama"
    },
    {
        "id": "4055",
        "name": "Rundreise Spanien"
    },
    {
        "id": "2208",
        "name": "Rundreise Costa Rica"
    },
    {
        "id": "2529",
        "name": "Rundreise Portugal"
    },
    {
        "id": "2222",
        "name": "Rundreise Sizilien"
    },
    {
        "id": "2505",
        "name": "Rundreise Kanaren"
    },
    {
        "id": "2570",
        "name": "Rundreise Malaysia"
    },
    {
        "id": "4179",
        "name": "Rundreise Usbekistan"
    },
    {
        "id": "4025",
        "name": "Rundreise Baltikum"
    },
    {
        "id": "2133",
        "name": "Rundreise Kalabrien"
    },
    {
        "id": "2214",
        "name": "Rundreise Griechenland"
    },
    {
        "id": "2146",
        "name": "Rundreise Japan"
    },
    {
        "id": "2545",
        "name": "Rundreise Australien"
    },
    {
        "id": "2115",
        "name": "Rundreise Südafrika"
    },
    {
        "id": "2527",
        "name": "Rundreise Asien"
    },
    {
        "id": "54",
        "name": "Rundreise Grönland"
    },
    {
        "id": "2229",
        "name": "Rundreise Kenia"
    },
    {
        "id": "2167",
        "name": "Rundreise Island"
    },
    {
        "id": "4187",
        "name": "Rundreise Israel"
    },
    {
        "id": "2257",
        "name": "Rundreise Thailand"
    },
    {
        "id": "946",
        "name": "Rundreise Türkei"
    },
    {
        "id": "2237",
        "name": "Rundreise Marokko"
    },
    {
        "id": "2507",
        "name": "Rundreise Balearen"
    },
    {
        "id": "2136",
        "name": "Rundreise Jordanien"
    },
    {
        "id": "2144",
        "name": "Rundreise Vietnam"
    },
    {
        "id": "4149",
        "name": "Rundreise Irland"
    },
    {
        "id": "948",
        "name": "Rundreise Sri Lanka"
    },
    {
        "id": "2235",
        "name": "Rundreise Malta"
    },
    {
        "id": "58",
        "name": "Rundreise Albanien"
    },
    {
        "id": "1010",
        "name": "Rundreise Nord-Mazedonien"
    },
    {
        "id": "2553",
        "name": "Rundreise Myanmar"
    },
    {
        "id": "2215",
        "name": "Rundreise Kreta"
    },
    {
        "id": "2242",
        "name": "Rundreise Mexiko"
    },
    {
        "id": "2206",
        "name": "Rundreise Bulgarien"
    },
    {
        "id": "4177",
        "name": "Rundreise Großbritannien"
    },
    {
        "id": "21",
        "name": "Rundreise Laos"
    },
    {
        "id": "44",
        "name": "Rundreise Südkorea"
    },
    {
        "id": "2213",
        "name": "Rundreise Frankreich"
    },
    {
        "id": "2556",
        "name": "Rundreise Südamerika"
    },
    {
        "id": "2548",
        "name": "Rundreise Kanada"
    },
    {
        "id": "959",
        "name": "Rundreise Tunesien"
    },
    {
        "id": "2159",
        "name": "Rundreise Toskana"
    },
    {
        "id": "2246",
        "name": "Rundreise Azoren"
    },
    {
        "id": "2276",
        "name": "Rundreise Zypern"
    },
    {
        "id": "2226",
        "name": "Rundreise Jamaika"
    },
    {
        "id": "994",
        "name": "Rundreise Neuseeland"
    },
    {
        "id": "2204",
        "name": "Rundreise Ägypten"
    },
    {
        "id": "4017",
        "name": "Rundreise Peru"
    },
    {
        "id": "2110",
        "name": "Rundreise Indonesien"
    },
    {
        "id": "960",
        "name": "Rundreise Nepal"
    },
    {
        "id": "41",
        "name": "Rundreise Slowenien"
    },
    {
        "id": "27",
        "name": "Rundreise Madagaskar"
    },
    {
        "id": "1006",
        "name": "Rundreise Andorra"
    },
    {
        "id": "2569",
        "name": "Rundreise Mittelamerika"
    }
    ]
},
{
    "id": "10034",
    "name": "Kreuzfahrten",
    "regions": [{
        "id": "4046",
        "name": "Kreuzfahrten Region Nordsee - Ostsee"
    },
    {
        "id": "2280",
        "name": "Kreuzfahrten Türkei"
    },
    {
        "id": "4005",
        "name": "Kreuzfahrten Region Mittelmeer"
    },
    {
        "id": "4160",
        "name": "Kreuzfahrten Europa"
    },
    {
        "id": "4126",
        "name": "Kreuzfahrten Indischer Ozean"
    },
    {
        "id": "4125",
        "name": "Kreuzfahrten Kanaren & Atlantik"
    },
    {
        "id": "2202",
        "name": "Nilkreuzfahrten"
    },
    {
        "id": "4120",
        "name": "Kreuzfahrten Südamerika"
    },
    {
        "id": "4010",
        "name": "Kreuzfahrten Kroatien"
    },
    {
        "id": "1026",
        "name": "Kreuzfahrten Asien"
    },
    {
        "id": "4121",
        "name": "Kreuzfahrten USA - Kanada"
    },
    {
        "id": "993",
        "name": "Kreuzfahrten Norwegen"
    },
    {
        "id": "4140",
        "name": "Fluß- & Kreuzfahrten Russland"
    },
    {
        "id": "4119",
        "name": "Kreuzfahrten Arabische Halbinsel"
    },
    {
        "id": "2149",
        "name": "Kreuzfahrten Region Karibik"
    },
    {
        "id": "4006",
        "name": "weitere Kreuzfahrten"
    }
    ]
},
{
    "id": "10035",
    "name": "Fly & Drive",
    "regions": [{
        "id": "4068",
        "name": "Fly & Drive Kalabrien"
    },
    {
        "id": "4083",
        "name": "Fly & Drive Griechenland"
    },
    {
        "id": "4077",
        "name": "Fly & Drive Menorca"
    }
    ]
},
{
    "id": "10036",
    "name": "Indischer Ozean",
    "regions": [{
        "id": "342",
        "name": "Malediven"
    },
    {
        "id": "143",
        "name": "Mauritius"
    },
    {
        "id": "719",
        "name": "Seychellen"
    },
    {
        "id": "163",
        "name": "Réunion"
    }
    ]
},
{
    "id": "10037",
    "name": "Mittelamerika",
    "regions": [{
        "id": "446",
        "name": "Panama"
    },
    {
        "id": "563",
        "name": "Costa Rica"
    },
    {
        "id": "4114",
        "name": "El Salvador"
    },
    {
        "id": "441",
        "name": "Guatemala"
    }
    ]
}
];

const topRegions = [
    {
        "id": "35",
        "name": "Mallorca"
    },
    {
        "id": "832",
        "name": "Fuerteventura"
    },
    {
        "id": "616",
        "name": "Kreta"
    },
    {
        "id": "434",
        "name": "Antalya &amp; Belek"
    },
    {
        "id": "350",
        "name": "Hurghada &amp; Safaga"
    },
    {
        "id": "56",
        "name": "Teneriffa"
    },
    {
        "id": "655",
        "name": "Rhodos"
    },
    {
        "id": "345",
        "name": "Gran Canaria"
    }
];


const regionTpl = {
    item: (rid, name) => {
        return `
                <li value="${rid}">${name}</li>`
    },
    outer: (items) => {
        return `
            <div class="searchWizard__advicehead">
                Top Reiseziele
                <div class="wizardLayer__close" onClick="closeSearchWizardLayer();"></div>
            </div>
            <ul>
                ${items}
                <div class="hxSpinner hxSpinner--overlay hide">
                    <div class="hxSpinner__inner">
                        <div class="hxSpinner__dot"></div>
                    </div>
                </div>
            </ul>`
    }
}

/**** region tools  */

let searchInput = '';


/**
 * Возращает одномерный массив объектов из родительских и дочерних регионов
 * @param regions {array} - входной массив данных
 * @return {array}
 */
function flatRegions(regions = []) {
    const ret = [];
    regions.forEach(item => {
        ret.push(
            {
                id: item.id,
                name: item.name
            }
        );
        ret.push(...item.regions);
    })
    return ret;
}

/**
 * Возращает отрендеренный дропбокс регионов в зависимости от наличия поисковой строки.
 * Если она не указана - возращает топовые регионы, иначе поиск по всем регионам по подстроке
 * @param searchInput {string} - поисковая строка
 * @return {html}
 */
function renderRegionsDropBox(searchInput = '') {
    if (searchInput.length < 3) {
        return renderRegionsTpl(topRegions);
    } else {

        const regionsFiltered = regions.filter(item => {
            return item.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
        })

        return renderRegionsTpl(regionsFiltered, searchInput);
    }
}

/**
 * Рендерит дропдаун регионов
 * Если есть поисковая строка, выделяет ее жирным
 * @param data {array} - входной массив регионов
 * @param searchInput {string} - поисковая строка
 * @return {html}
 */

function renderRegionsTpl(data, searchInput = '') {
    const items = (data) => {
        let ret = '';
        data.forEach(item => {
            let item_name = item.name;
            if (searchInput) {
                const re = new RegExp("(" + searchInput + ")", "gi");
                //item.name = item.name.replace(re, '<b>$1</b>');
                item_name = item.name.replace(re, '<b>$1</b>');
            }
            ret += regionTpl.item(item.id, item_name);
        })
        return ret
    }
    return regionTpl.outer(items(data))
}

// Получаем плоский массив регионов
regions = flatRegions(regions);

/******** old  */


var freeTextSearchObject = {};

$(function () {
    searchMaskSetEventHandler();
});


function searchMaskSetEventHandler() {
    $("#topRegion").freeTextSearch({ textChangedHandler: searchMaskTopRegionHandler });
    $("#agencyFinderSearchvalue").freeTextSearch({ textChangedHandler: regionFinderHandler });
}

$(document).on("click", ".searchWizard__input--destination", function (e) {
    e.preventDefault();
    getMostVisitedRegionsCruise($('#topRegion').val());

});

$(document).on("click", ".searchWizard__input--cruiseCompany", function (e) {
    e.preventDefault();
    getCruiseCompanies();

});

$(document).on("click", ".searchWizard__input--typesOfCruise", function (e) {
    e.preventDefault();
    getTypesOfCruise();

});

function getMostVisitedRegionsCruise(val) {
    var masktype = $(".searchWizard__tabinner--active").data('masktype');
    if (val == "" && masktype != "holidayhome") {
        //	$('#topRegionResult .hxSpinner').removeClass('hide');
        $('#topRegionResult').removeClass('hide');

        var data = { action: "getMostVisitedRegions", controller: "searchWizzard", masktype: masktype };

        if (masktype === "cruise") {
            data['action'] = 'getDestinations';
            data['searchInput'] = val;
        }

        html = renderRegionsDropBox('');
        $('#topRegionResult').html(html);
        /*
                $.ajax({
                    url: g_rootUrl + "/_ajax/controller.cfm",
                    data: data ,
                    cache: false,
                    dataType:'json',
                    success: function (result)
                    {
        
                        $('#topRegionResult').html(result.html);
                        $('.hxSpinner').addClass('hide');
                        //$.fn.freeTextSearch({textChanged:true});				
                    	
                        if( result.emptylist ){
                            $('#topRegionResult .hxSpinner').addClass('hide');
                            $('#topRegionResult').addClass('hide');
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){}
                });*/
    }

}

function getCruiseCompanies() {
    //var masktype = $(".searchWizard__tabinner--active").data('masktype');

    //if(	masktype == "cruises"){

    $('#cruiseCompaniesResult .hxSpinner').removeClass('hide');
    $('#cruiseCompaniesResult').removeClass('hide');

    var data = { action: "getCruiseCompanies", controller: "searchWizzard", masktype: 'cruises' };

    $.ajax({
        url: g_rootUrl + "/_ajax/controller.cfm",
        data: data,
        cache: false,
        dataType: 'json',
        success: function (result) {

            $('#cruiseCompaniesResult').html(result.html);
            $('#cruiseCompaniesResult .hxSpinner').addClass('hide');
            //$.fn.freeTextSearch({textChanged:true});				

            if (result.emptylist) {
                $('#cruiseCompaniesResult .hxSpinner').addClass('hide');
                $('#cruiseCompaniesResult').addClass('hide');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#cruiseCompaniesResult .hxSpinner').addClass('hide');
        }
    });
    //}

}

function getTypesOfCruise() {
    //var masktype = $(".searchWizard__tabinner--active").data('masktype');
    //if(	masktype == "cruises"){

    $('#typesOfCruise .hxSpinner').removeClass('hide');
    $('#typesOfCruise').removeClass('hide');

    var data = { action: "getTypesOfCruise", controller: "searchWizzard", masktype: 'cruises' };

    $.ajax({
        url: g_rootUrl + "/_ajax/controller.cfm",
        data: data,
        cache: false,
        dataType: 'json',
        success: function (result) {

            $('#typesOfCruise').html(result.html);
            $('.hxSpinner').addClass('hide');
            //$.fn.freeTextSearch({textChanged:true});				

            if (result.emptylist) {
                $('#typesOfCruise .hxSpinner').addClass('hide');
                $('#typesOfCruise').addClass('hide');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) { }
    });
    //}
}



function searchMaskTopRegionHandler(freeTextSearch) {
    //console.log(freeTextSearch)
    console.log(freeTextSearch.qryStr);
    freeTextSearchObject = freeTextSearch;

    $('#topRegionResult').removeClass('hide');

    //if( freeTextSearch.qryStr !== "") $( '.hxSpinner' ).not('#agencyFinderSpinner').removeClass('hide');
    var data = { action: "getTopRegions", controller: "searchWizzard", searchInput: freeTextSearch.qryStr };
    var masktype = $(".searchWizard__tabinner--active").data('masktype');
    data.masktype = (masktype === undefined) ? "" : masktype;
    data.action = (masktype === "cruise") ? "getDestinations" : data.action;
    $('#rid').val("");

    html = renderRegionsDropBox(freeTextSearch.qryStr);
    $('#topRegionResult').html(html);
    $.fn.freeTextSearch({ textChanged: true });
    /*
        $.ajax({
            url: g_rootUrl + "/_ajax/controller.cfm",
            data: data ,
            cache: false,
            dataType:'json',
            success: function (result)
            {					
                $('#topRegionResult').html(result.html);
                $('.hxSpinner').addClass('hide');
                $.fn.freeTextSearch({textChanged:true}); 
        	
                if( result.emptylist )
                {
                    $('#topRegionResult').addClass('hide');
                }
            },
            error: function(jqXHR, textStatus, errorThrown){}
        });*/
}


$(document).on("click", ".searchWizard__advicelist--toplist ul li", function (e) {
    var $this = $(this);
    var $input = $("#topRegion");
    var masktype = $(".searchWizard__tabinner--active").data('masktype');


    $('#rid').val($this.val());
    $input.freeTextSearch('setInputText', $this.text());

    //Update 19.03.2018 (Emdadul) : Call these methods only if masktype != cruise
    if (masktype != 'cruise') {
        openSearchLayer(this);
        searchMaskAirportInput(masktype);
    } else {
        openSearchLayer(this);
        getDepartureDatepicker(this, true);
    }

    $('#topRegionResult').addClass('hide');

});

$(document).on("click", ".searchWizard__advicelist--typesOfCruiseList ul li", function (e) {
    var $this = $(this);
    var $pickedValue = '';

    switch ($this.val()) {
        case 1:
            $pickedValue = 'NS';
            break;
        case 2:
            $pickedValue = 'S';
            break;
        case 3:
            $pickedValue = 'R';
            break;
        case 4:
            $pickedValue = 'KOMBI';
            break;
        default:
            $pickedValue = 'NS';

    }


    $('#typesOfCruiseLabel').html($this.text());
    $('#typeOfCruiseInput').val($pickedValue);

    $('#typesOfCruise').addClass('hide');


    closeSearchWizardLayer(this);

});


function regionFinderHandler(freeTextSearch) {
    $.ajax({
        url: g_rootUrl + "/_ajax/controller.cfm",
        data: {
            action: "getInputResults",
            controller: "agencyFinder",
            searchInput: freeTextSearch.qryStr
        },
        cache: false,
        success: function (result) {
            if (result.length > 1) {
                $('#regionFinderResults').html(result);
                $('#regionFinderResults').fadeIn();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) { }
    });
}


$(document).on("click", ".wizardLayer__button--departures", function (e) {
    input = $('input[name="departures[]"]:checked');

    if ($(this).hasClass('wizardLayer__button--accept') && input.val() != "") {
        $('input[name="depap"]').val(input.val());
        closeSearchWizardLayer();
    }
});







function SetDropDownValue(val) {

}












/**
 * Run Search
 */

function initSearch() {
    var regionCombo = $("#regionCombo").val();
    if (regionCombo) {
        var region = regionCombo.split("!");
        $("#rid").val(region[0]);
        $("#topRegion").val(region[1]);
    }
    //debugger;
    /* Setting Default departure data **/
    var ddate = $("#ddate").val();
    var depValue = parseInt(ddate);
    var someDate = new Date();
    if (depValue > 0) {
        if (depValue <= 4) {
            var numberOfDaysToAdd = depValue * 7;
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
        } else if (depValue == 5) {
            someDate.setMonth(someDate.getMonth() + 1);
        } else if (depValue == 6) {
            someDate.setMonth(someDate.getMonth() + 2);
        }
        $("#ddate").val(myDateFormatter(someDate, "-", "year"));
        $("#departure").html(myDateFormatter(someDate, ".", "day"));
    } else {
        //Set empty
        $("#ddate").val("");
        $("#departure").html("Anreise");
    }
    /* Setting Default Return data **/
    var rdate = $("#rdate").val();
    var retValue = parseInt(rdate);
    var todayDate = new Date();
    if (retValue > 0) {
        if (retValue <= 4) {
            var numberOfDaysToAdd = retValue * 7;
            todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
        } else if (retValue == 5) {
            todayDate.setMonth(todayDate.getMonth() + 1);
        } else if (retValue == 6) {
            todayDate.setMonth(todayDate.getMonth() + 2);
        }
        $("#rdate").val(myDateFormatter(todayDate, "-", "year"));
        $("#returnDate").html(myDateFormatter(todayDate, ".", "day"));
    } else {
        //Set empty
        $("#rdate").val("");
        $("#returnDate").html("Rückreise");
    }
    // var date = new Date(ddate);
    // var constantDays = 14;
    // var newDate = date.setDate(date.getDate() + constantDays);
    // var newReturnDateString = new Date(newDate).toUTCString();
    // $("#returnDate").html(myDateFormatter(newReturnDateString,".","day"));
    // $("#rdate").val(myDateFormatter(newReturnDateString,"-","year"));
    var kids = $("#child").val();
    //alert(kids);
    if (kids) {
        var kidArray = kids.split(",");
        //alert(kidArray.length);
        for (var i = 0; i < kidArray.length; i++) {
            //alert(kidArray[i]);
            $("#kidsInput").attr("value", i);
            $("#MoreKids").trigger("click");
            $("#age" + (i + 1) + " ").val(kidArray[i]);
            //alert( $("#age"+(i+1)+" ").length );
            //alert( $("#age"+(i+1)+" ").val() );
            //kidArray[i];
        }
    } else {
        $("#passengers").html($("#adultInput").val() + " Erw. / keine Kinder");
        $("#kidsInput").attr("value", 0);
        $("#child").val(0);
    }
    if ($("#kidsInput").val() == "" || $("#kidsInput").val() == 0 || $("#kidsInput").val() == "0") {
        $("#passengers").html($("#adultInput").val() + " Erw. / keine Kinder");
    } else {
        $("#passengers").html($("#adultInput").val() + " Erw. / " + $("#kidsInput").val() + " Kinder");
    }
    var depap = $("#depapCombo").val();
    if (depap) {
        depap = depap.split("!");
        $("#airportLabel").html(depap[1]);
        $("#depap").val(depap[0]);
    }

    setTimeout(function () {
        $("#" + "paushal").click();
    }, 1000);
}


if ($('#searchWizardForm').length) {
    initSearch()
}


(function ($) {
    window.addEventListener('message', function (message) {
        if (message.data.event === 'iberesized') {
            $('#ttResizeIBE').height(message.data.height);
        } else if (message.data.action) {
            /*
            Handle Kreuzportal IBE resize
            20.03.2018
            Added by Emdadul
            */
            switch (message.data.action) {
                case "resize":
                    document.getElementById("ttResizeIBE").style.height = message.data
                        .height + "px";
                    break;
                case "scroll":
                    window.scrollBy(0, (message.data.top + document.getElementById(
                        "ttResizeIBE").getBoundingClientRect().top));
                    break;
                case "navigate":
                    window.scrollBy(0, document.getElementById("ttResizeIBE")
                        .getBoundingClientRect().top);
                    break;
            }
        }
    }, false);
})(jQuery);


/************ ************ searchWizard ************ ************/
function openSearchLayer(actElem) {

    $('.searchWizard__layer').hide();

    if ($(actElem).hasClass('searchWizard__advicelist__input')) {
        $('.searchWizardOverlay').fadeOut();
    } else {
        $('.searchWizardOverlay').fadeIn();
        $(actElem).parents('.searchWizard__col').find('.searchWizard__layer').show();
        $('.searchWizard__advicelist__input').siblings('.advicelist__hide').addClass('hide');
    }
}

$(function () {
    $('.searchWizardOverlay').click(function (event) {
        $(this).hide();
        $('.searchWizard__layer').hide();
        $('#topRegionResult').addClass('hide');
        $('#typesOfCruise').addClass('hide');
    });

    $('.cmsDatePicker__close').click(function (event) {
        $('.searchWizardOverlay').hide();
        $('.searchWizard__layer').hide();
    });

    $('.searchWizard__tabcontrol--select').click(function (event) {
        $('.searchWizard').toggleClass('searchWizard--opentabs');
    });


    /*
    ****************************************************
    @function : searchMaskAirportInput

    Modified on 01.02.2017 (first) by Emdadul Sadik to
    To change search Mask's form fields.

    Emdadul (cfmes) on 19.03.2018 : Kreuzfahrten related changes.

    ****************************************************
    */

    $(document).on('click', '.searchWizard__tab', function (event) {
        $('.searchWizard__tab').removeClass('searchWizard__tab--active');
        $('.searchWizard__tabinner').removeClass('searchWizard__tabinner--active');

        $(this).addClass('searchWizard__tab--active');
        $(this).find('.searchWizard__tabinner').addClass('searchWizard__tabinner--active');

        $('.searchWizard').removeClass('searchWizard--opentabs');
        $('#airportInput').find('.searchWizard__layer').hide();
        $('#topRegion').attr('placeholder', 'Reiseziel');

        //BLK01 Changes by Emdadul 19.03.2018
        var depapCombo = $("#depapCombo").val();
        var regionCombo = $("#regionCombo").val();
        if (depapCombo) {
            $("#airportLabel").html(depapCombo.split("!")[1]);
            $('#depap').val(depapCombo.split("!")[0]);
        }

        if (regionCombo) {

            $('#rid').val(regionCombo.split("!")[0]);
            $("#topRegion").val(regionCombo.split("!")[1]);
        }

        $('#airportInput .searchWizard__input').removeClass('searchWizard__input--cruise');
        $('#airportInput .searchWizard__input').addClass('searchWizard__input--airport');
        // $('#airportInput .searchWizard__input').text('Abflughafen');
        $('#airportInput').removeClass('hide');
        $('#fill').hide();

        // fo 22.10.18 SD-80: add field for cruiseCompany
        $('#cruiseCompanyInput .searchWizard__input').removeClass('searchWizard__input--cruiseCompany');
        $('#cruiseCompanyInput').addClass('hide');

        // fo 22.10.18 SD-80: add field for typeOfCruise
        $('#typesOfCruiseInput .searchWizard__input').removeClass('searchWizard__input--typesOfCruise');
        $('#typesOfCruiseInput').addClass('hide');

        $('#passengerInput').removeClass('hide');



        if (freeTextSearchObject.hasOwnProperty('qryStr') && freeTextSearchObject.qryStr !== "")
            searchMaskTopRegionHandler(freeTextSearchObject);


        //Done by ubaid rana.. Added 'or' condition
        if ($(this).text().trim().localeCompare("Hotel") == 0 || $(this).text().trim().localeCompare("Ferienhäuser") == 0) {
            $('#airportInput').addClass('hide');
            $('#fill').show();
            $('input[name=depap]').val('');

        } else if ($(this).text().trim().localeCompare("Kreuzfahrten") == 0) {

            $('input[name=depap]').val('');
            $('input[name=rid]').val('');
            $('#topRegion').attr('placeholder', 'Fahrgebiet');
            $('#fill').show();

            $('#airportInput .searchWizard__input').removeClass('searchWizard__input--airport');
            $('#airportInput .searchWizard__input').addClass('searchWizard__input--cruise');
            $('#airportInput .searchWizard__input').text('Zielgebiet');
            // 19.03.2018 : We have decided to remove this whole column because we will do it later when customer will ask for (according to Max.)
            $('#airportInput').addClass('hide');

            // fo 22.10.18 SD-80: add field for cruiseCompany
            $('#cruiseCompanyInput .searchWizard__input').addClass('searchWizard__input--cruiseCompany');
            $('#cruiseCompanyInput .searchWizard__input').text('Reederei');
            $('#cruiseCompanyInput').removeClass('hide');

            // fo 22.10.18 SD-80: add field for typeOfCruise
            $('#typesOfCruiseInput .searchWizard__input').addClass('searchWizard__input--typesOfCruise');
            $('#typesOfCruiseInput .searchWizard__input').text('Reiseart');
            $('#typesOfCruiseInput').removeClass('hide');


            $('#passengerInput').addClass('hide');


        } else {

            // Commented out by Emdadul (19.03.2018). Same is in action on BLK01 on top of this event.
            /*
                $('#airportInput').show();
                $('#fill').hide();
                $('#airportInput .searchWizard__input').text('Abflughafen');

                $('#depap').val("");
                $('#airportInput .searchWizard__input').removeClass('searchWizard__input--cruise');
            */

        }

        $('#travelType').val($(this).data('masktype'));
        $('.searchWizard').addClass('searchWizard--opentabs');
    });

    // click once


});

function closeSearchWizardLayer(event) {
    $('.searchWizardOverlay').hide();
    $('.searchWizard__layer').hide();
    $('#topRegionResult').addClass('hide');
    $('#typesOfCruise').addClass('hide');

    //getDepartureDatepicker(this);
}

function setPassengers(actElem) {
    if ($("#kidsInput").val() == "" || $("#kidsInput").val() == 0 || $("#kidsInput").val() == "0") {
        $('#passengers').html($("#adultInput").val() + ' Erw. / keine Kinder');
    }
    else {
        $('#passengers').html($("#adultInput").val() + ' Erw. / ' + $("#kidsInput").val() + ' Kinder');
    }


    $("#adult").val($("#adultInput").val());

    var children = parseInt($("#kidsInput").val());

    if (children > 0) {
        var ages = [];
        $.each($('select[name="ages[]"]').serializeArray(), function (k, v) { ages.push(v.value); });
        $("#child").val(ages.toString());
    }
}

function setAirports(actElem) {
    var checkboxes = $('.airportChk:checked');
    var arrayLengthOriginal = checkboxes.length;
    var arrayLength = checkboxes.length;
    var valueString = "";
    var checkbox = '';

    if (arrayLength > 0) {
        for (var i = 0; i < arrayLengthOriginal; ++i) {
            checkbox = checkboxes[i];

            if (checkbox.className.indexOf('airportsGroup') != -1)
                arrayLength--;
            else
                valueString += checkbox.value + ',';
        }
        valueString = valueString.substring(0, valueString.length - 1);
        $('#depap').val(valueString);

        if (arrayLength > 1)
            $('#airportLabel').html(arrayLength + " Flughäfen");

        else {
            checkbox = checkboxes[0];
            $('#airportLabel').html(checkbox.getAttribute('data-name'));
        }
    }
    else {
        $('#depap').val('');
        $('#airportLabel').html('Abflughafen');
    }
}

function setCruiseCompanies(actElem) {
    var checkboxes = $('.cruiseCompanyChk:checked');
    var arrayLengthOriginal = checkboxes.length;
    var arrayLength = checkboxes.length;
    var valueString = "";
    var checkbox = '';

    if (arrayLength > 0) {
        for (var i = 0; i < arrayLengthOriginal; ++i) {

            checkbox = checkboxes[i];

            if (checkbox.className.indexOf('cruiseCompaniesGroup') != -1)
                arrayLength--;
            else
                valueString += checkbox.value + ',';
        }
        valueString = valueString.substring(0, valueString.length - 1);
        $('#cruiseCompaniesInput').val(valueString);

        if (arrayLength > 1)
            $('#cruiseCompanyLabel').html(arrayLength + " Reedereien");

        else {
            checkbox = checkboxes[0];
            $('#cruiseCompanyLabel').html(checkbox.getAttribute('data-name'));
        }

    }
    else {
        $('#cruiseCompaniesInput').val('');
        $('#cruiseCompanyLabel').html('Reederei');
    }

    closeSearchWizardLayer();

    openSearchLayer(this);
    searchMaskTypesOfCruiseInput();

}

/*
****************************************************
@function : searchMaskAirportInput

Modified on 26.01.2017 (first) by Emdadul Sadik to
adopt departures of cruise portal primarily.

****************************************************
*/

function searchMaskAirportInput(argument) {

    var data = { action: "getAirports", controller: "searchWizzard" };
    var masktype = $(".searchWizard__tabinner--active").data('masktype');
    data.masktype = (masktype === undefined) ? "" : masktype;
    data.action = (masktype === "cruise") ? "getDepartures" : data.action;
    var rid = $("input[name=rid]").val();
    data.rid = (rid === undefined) ? "" : rid;

    $.ajax({
        //url: g_rootUrl + "/_ajax/controller.cfm",
        url: g_rootUrl + "/_ajax/getAirports.html",
        data: data,
        cache: false,
        // async: false,
        success: function (result) {
            if (result.length > 1) {
                $('.searchWizard__layer').hide();
                $('#airports').html(result);
                var depap = $("#depap").val();
                if (depap) {
                    depApCodes = depap.split(",");
                    //$("#airportLabel").html(depap[1]);
                    for (var i = 0; i < depApCodes.length; i++) {
                        $(":checkbox[value=" + depApCodes[i] + "]").prop("checked", "true");
                    }
                }

                if (masktype == 'holidayhome' || masktype == 'hotel') {
                    $('#passengerInput').find('.searchWizard__layer').show();
                }

                $('#airportInput').find('.searchWizard__layer').show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}


/*
****************************************************
cruisecontrollers

25.10.2018 cfmfo

****************************************************
*/

function searchMaskCruiseCompanyInput() {

    var data = { action: "getCruiseCompanies", controller: "searchWizzard" };
    var masktype = $(".searchWizard__tabinner--active").data('masktype');
    data.masktype = (masktype === undefined) ? "" : masktype;
    data.action = (masktype === "cruise") ? "getCruiseCompanies" : data.action;
    var rid = $("input[name=rid]").val();
    data.rid = (rid === undefined) ? "" : rid;

    $.ajax({
        url: g_rootUrl + "/_ajax/controller.cfm",
        data: data,
        cache: false,
        // async: false,
        success: function (result) {
            if (result.length > 1) {
                $('.searchWizard__layer').hide();
                $('#cruiseCompanies').html(result);

                $('#cruiseCompanyInput').find('.searchWizard__layer').show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
        }
    });
}

function searchMaskTypesOfCruiseInput() {

    var data = { action: "getTypesOfCruise", controller: "searchWizzard" };
    var masktype = $(".searchWizard__tabinner--active").data('masktype');
    data.masktype = (masktype === undefined) ? "" : masktype;
    data.action = (masktype === "cruise") ? "getTypesOfCruise" : data.action;
    var rid = $("input[name=rid]").val();
    data.rid = (rid === undefined) ? "" : rid;


    $.ajax({
        url: g_rootUrl + "/_ajax/controller.cfm",
        data: data,
        cache: false,
        // async: false,
        success: function (result) {
            if (result.length > 1) {
                $('.searchWizard__layer').hide();
                $('#typesOfCruise').html(result);


                $('#typesOfCruiseInput').find('.searchWizard__layer').show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}



function getDepartureDatepicker(caller, update) {

    if (!update) {
        $('.searchWizardOverlay').fadeIn();
        $('.searchWizard__layer').hide();
    }

    var month = 0;

    if ($(caller).length > 0 && $(caller).val().length > 0) {
        month = $(caller).val();
    }
    else {
        var depp = $('#ddate').val();
        var reg = depp.split("-");
        month = reg[1] + reg[0];

        if (month[0] === '0') {
            month = month.substring(1);
        }
    }
    if (month == 'undefined') {
        month = `${new Date().getMonth() + 1}${new Date().getFullYear()}`
    }
    console.log(month)
    $('#departureDatepicker').html(renderDatepicker(1, month, -1));

    $('#departure').parents('.searchWizard__col').find('.searchWizard__layer').show();
    $('#departure').parents('.searchWizard__col').find('.searchWizard__layer').cfmCalendar();



    /*
        $.ajax({
            url: g_rootUrl + "/_ajax/controller.cfm",
            data: {
                    action: "getDatePicker",
                    controller: "searchWizzard",
                    type: 1,
                    month: month,
                    duration: $( '#dur' ).val()
                  },
    
    
    
            cache: false,
            // async: false,
            success: function (result,caller)
            {
                if (result.length > 1)
                {
                    $( '#departureDatepicker' ).html(result);
    
                    $( '#departure').parents('.searchWizard__col').find('.searchWizard__layer').show();
                    $( '#departure').parents('.searchWizard__col').find('.searchWizard__layer').cfmCalendar();
    
    
                }
            },
    
            error: function(jqXHR, textStatus, errorThrown)
            {
            }
        });
        */
}

function getReturnDatepicker(caller, update) {

    if (!update) {
        $('.searchWizardOverlay').fadeIn();
        $('.searchWizard__layer').hide();
    }

    var month = 0;

    if ($(caller).length > 0 && $(caller).val().length > 0) {
        month = $(caller).val();
    }
    else {
        var depp = $('#rdate').val();
        var reg = depp.split("-");

        month = reg[1] + reg[0];

        if (month[0] === '0') {
            month = month.substring(1);
        }
    }

    if (month == 'undefined') {
        month = `${new Date().getMonth() + 1}${new Date().getFullYear()}`
    }


    /*$.ajax({
        url: g_rootUrl + "/_ajax/controller.cfm",
        data: {
                action: "getDatePicker",
                controller: "searchWizzard",
                type: 2,
                month: month,
                duration: $( '#dur' ).val()
              },
        cache: false,
        //async: false,
        success: function (result)
        {
            if (result.length > 1)
            {*/

    result = renderDatepicker(2, month, $('#dur').val())
    $('#returnDatepicker').html(result);

    $('#returnDate').parents('.searchWizard__col').find('.searchWizard__layer').show();

    $('#returnDate').parents('.searchWizard__col').find('.searchWizard__layer').cfmCalendar();
    //debugger;

    var depp = $('#ddate').val();
    var reg = depp.split("-");
    var returnMonth = parseInt(reg[1]);
    var date = reg[2];
    var year = reg[0];
    var departureMonth = 0;
    var departureYear = 0;
    //alert(month.length);
    if (month.length == 5) {
        departureMonth = parseInt(month.substring(0, 1));
        departureYear = parseInt(month.substring(1));
    }
    else {
        departureMonth = parseInt(month.substring(0, 2));
        departureYear = parseInt(month.substring(2));
    }

    var lockDay = 0;
    if (departureYear < parseInt(year) || (departureYear == parseInt(year) && departureMonth < returnMonth)) {
        lockDay = 32;
    }
    else if (departureYear == parseInt(year) && departureMonth == returnMonth) {
        lockDay = date;
    }
    for (var i = 0; i < lockDay; i++) {
        if (i < 10) {
            $("#returnDatepicker").find("[data-day='" + 0 + i + "']").addClass("passed");
        }
        $("#returnDatepicker").find("[data-day='" + i + "']").addClass("passed");
    };
    $("#retDropdown").unbind("change");
    /*}
},
error: function(jqXHR, textStatus, errorThrown)
{
}
});*/
}


function submitSearchform() {
    // var startDate = new Date($('#departure').val());
    // var endDate = new Date($('#returnDate').val());

    // if (startDate && endDate && startDate >= endDate){
    // 	$.notify("Return date should be later than Departure date", "error");
    // 	return false;
    // }
    data = { controller: "searchWizzard", action: "builtSubmitUrl" };
    formdata = $(".searchWizard input[type=hidden]").serializeArray();
    $.each(formdata, function (k, v) { data[v.name] = v.value; });
    var masktype = $(".searchWizard__tabinner--active").data('masktype');
    data.masktype = (masktype === undefined) ? "" : masktype;
    data.action = (masktype === "cruise") ? "buildCruiseJumpURL" : data.action;

    // debugger;

    let url = `/buchen?adult=${data.adult}&typ=1&dur=${data.dur}&stars=3&rid=${data.rid}&ibe=${data.ibe}&departureDate=${data.ddate}&durationSelect=${data.dur}&returnDate=${data.rdate}&depap=${data.depap}`;

    if (data.child != 0) {
        url = `${url}&childAge=${data.child}`
    } else {
        $('#child').get(0).value = '';
        data.child = '';

    }

    document.searchWizardForm.action = url;
    document.getElementById('searchWizardForm').submit();

    console.log(url);

    /*
        $.ajax({
            url: g_rootUrl + "/_ajax/controller.cfm",
            data : data ,
            dataType: "json",
            cache: false,
            success: function (result)
            {
                if (result.hasOwnProperty('jumpurl'))
                {
                    document.searchWizardForm.action = result['jumpurl'];
                    document.getElementById('searchWizardForm').submit();
                }
    
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log(errorThrown);
            }
        });*/

    return false;
}


function updateDepartureDate(caller) {

    //var dayObject = $( caller ).parents('.cmsDatePicker__calframe').find('.cmsDatePicker__day.active');
    var dayObject = $(caller);
    var day = dayObject.data("day");
    var month = dayObject.data("month");
    var year = dayObject.data("year");
    if (typeof (day) == "undefined" || typeof (month) == "undefined" || typeof (year) == "undefined") {
        alert("Wählen Sie die Datum");
        return false;
    }
    if (day.toString().length == 1) { day = '0' + day; }
    if (month.toString().length == 1) { month = '0' + month; }

    $("#departure").html(day + "." + month + "." + year);
    $("#departure").val(month + "" + year);
    $("#returnDate").val(month + "" + year);
    $("#ddate").val(year + "-" + month + "-" + day);

    $("#dur").val($('#durationSelect').val());

    closeSearchWizardLayer();
    $("#returnDate").html($('#departure').html());



    //alert(day);
    /*for(var i= 0; i<day; i--){
    $("div").find("[data-day ='"+ i + "']").addClass("passed");
    }*/

    getReturnDatepicker(returnDate);


    //$("#returnDate").html("");
    //getReturnDatepicker();

    return false;
}

function updateReturnDate(caller) {

    var dayObject = $(caller).parents('.cmsDatePicker__calframe').find('.cmsDatePicker__day.active');

    var day = dayObject.data("day");
    var month = dayObject.data("month");
    var year = dayObject.data("year");


    if (typeof (day) == "undefined" || typeof (month) == "undefined" || typeof (year) == "undefined") {
        var returnDate = $("#returnDate").html();
        if (!returnDate && returnDate.indexOf(".")) {
            alert("Wählen Sie die Datum");
            return false;
        }
        var dateSelected = returnDate.split(".");
        var day = dateSelected[0];
        var month = dateSelected[1];
        var year = dateSelected[2];

    }
    if (day.toString().length == 1) { day = '0' + day; }
    if (month.toString().length == 1) { month = '0' + month; }

    $("#returnDate").html(day + "." + month + "." + year);
    $("#departure").val(month + "" + year);
    $("#returnDate").val(month + "" + year);
    $("#rdate").val(year + "-" + month + "-" + day);
    var durationValue = $('#durationSelect').val();
    $('#dur').val(durationValue);

    $('#durationSelect option[value=' + durationValue + ']').prop("selected", true);

    closeSearchWizardLayer();

    var masktype = $(".searchWizard__tabinner--active").data('masktype');
    if (masktype == 'cruise') {
        openSearchLayer(this);
        searchMaskCruiseCompanyInput();

    }


    return false;
}


/************ ************ searchWizard ************ ************/


/************ ************ Date format setting  ************ ************/

function myDateFormatter(dateObject, separator, firstDateParam) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    if (firstDateParam == "year")
        return year + separator + month + separator + day;
    else
        return day + separator + month + separator + year;
};




/************ ************ inputMoreLess ************ ************/
const agesTop = `<div class="wizardLayer__head cmsMarginTop10">
    Alter der Kinder
</div>`;


const agesSelect = (count) => {
    return `
    <div class="wizardLayer__group">
        <div class="wizardLayer__name">Kind ${count}:</div>
        <div class="wizardLayer__select">
            <select name="ages[]" id="age${count}">
                <option value="1" selected> < 2 Jahre </option>
                <option value="2"> 2 Jahre </option>
                <option value="3"> 3 Jahre </option>
                <option value="4"> 4 Jahre </option>
                <option value="5"> 5 Jahre </option>
                <option value="6"> 6 Jahre </option>
                <option value="7"> 7 Jahre </option>
                <option value="8"> 8 Jahre </option>
                <option value="9"> 9 Jahre </option>
                <option value="10"> 10 Jahre </option>
                <option value="11"> 11 Jahre </option>
                <option value="12"> 12 Jahre </option>
                <option value="13"> 13 Jahre </option>
                <option value="14"> 14 Jahre </option>
                <option value="15"> 15 Jahre </option>
                <option value="16"> 16 Jahre </option>
                <option value="17"> 17 Jahre </option>
            </select>
        </div>
    </div>
    `
}

const agesBottom = `
<div class="hxSpinner hxSpinner--overlay hide">
    <div class="hxSpinner__inner">
        <div class="hxSpinner__dot"></div>
    </div>
</div>`;

const agesMain = (count) => {
    let ret = '';
    for (let i = 1; i <= count; i++) {
        ret = ret + agesSelect(i)
    }
    return ret
}



$('.inputMoreLess__button').click(function (event) {

    $('#addKids').css('pointer-events', 'none');
    var mode = $(this).data('mode');
    var action = $(this).data('typ');
    var actInput = $(this).parents('.inputMoreLess').find('input');
    var actVal = actInput.attr('value');
    var ages = [];

    if ((mode.localeCompare('kids') == 0 &&
        (action == 'add' && actVal < 3)) ||
        (mode.localeCompare('adults') == 0 &&
            (action == 'add' && actVal < 4)) ||
        action == 'remove') {
        if (action == 'add') {
            actVal = ++actVal;
            actInput.attr('value', actVal);
        } else if (action == 'remove') {
            if (actVal > 0) {
                actVal = --actVal;
                actInput.attr('value', actVal);
            }
        }
    }

    if (mode.localeCompare('kids') == 0) {
        $('.hxSpinner').removeClass('hide');

        data = { controller: "searchWizzard", action: "getKidAgeSelectInputs", numberofchildren: actVal };

        if (actVal >= 1) {
            $('select[name="ages[]"]').each(function (index, elem) {
                ages.push($(elem).val());
            });
            // $.each(  $('select[name="ages[]"]').serializeArray() ,  function(k,v) {  ages.push(v.value);  }  );
            data.ages = ages;
        }

        $('#addKids').css('pointer-events', 'none');

        const agetTpl = agesTop + agesMain(actVal) + agesBottom;
        $('#kidsAge').html(agetTpl);
        $('.hxSpinner').addClass('hide');
        /*
                $.ajax({
                    url: g_rootUrl + "/_ajax/controller.cfm",
                    data: data,
                    cache: false,
                    async: false,
                    success: function (result)
                    {
                    $('#addKids').css( 'pointer-events', '' );
                        $('#kidsAge').html( result );
                        $( '.hxSpinner' ).addClass('hide');
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        $( '.hxSpinner' ).addClass('hide');
                    }
                });*/
    }
});
/************ ************ inputMoreLess ************ ************/


/** Date Picker */
const searchWizardDateTpl = {
    header: ['Früheste Hinreise', 'Späteste Rückreise'],
    monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    durationsValues: [
        { value: "-1", name: " Beliebig" },
        { value: "7", name: "1 Woche" },
        { value: "14", name: "2 Wochen" },
        { value: "21", name: "3 Wochen" },
        { value: "28", name: "4 Wochen" },
        { value: "1", name: "1 Tag" },
        { value: "2", name: "2 Tage" },
        { value: "3", name: "3 Tage" },
        { value: "4", name: "4 Tage" },
        { value: "5", name: "5 Tage" },
        { value: "6", name: "6 Tage" },
        { value: "7", name: "7 Tage" },
        { value: "8", name: "8 Tage" },
        { value: "9", name: "9 Tage" },
        { value: "10", name: "10 Tage" },
        { value: "11", name: "11 Tage" },
        { value: "12", name: "12 Tage" },
        { value: "13", name: "13 Tage" },
        { value: "14", name: "14 Tage" },
        { value: "15", name: "15 Tage" },
        { value: "16", name: "16 Tage" },
        { value: "17", name: "17 Tage" },
        { value: "18", name: "18 Tage" },
        { value: "19", name: "19 Tage" },
        { value: "20", name: "20 Tage" },
        { value: "21", name: "21 Tage" },
        { value: "g", name: "&gt; 21 Tage" },
    ],
    monthOptions: (monthName, month, year) => `<option value="${month}${year}">${monthName} ${year}</option>
    `,
    monthCurrent: (monthName, month, year) => `<div class="cmsDatePicker-months__current" data-month="${month}" data-year="${year}">${monthName} ${year}</div>`,

    day: (day, month, year, passed, type) => `<div class="cmsDatePicker__day ${passed ? 'passed' : ''}" ${type == 1 ? 'onClick="return updateDepartureDate(this);"' : ''} data-day="${`${+day + 100}`.substring(1)}" data-month="${`${+month + 100}`.substring(1)}" data-year="${year}">
        <span>${day}</span></div>
    `,

    durations: (durationOptions) => `
    <div class="wizardLayer__head cmsMarginTop10">
        Reisedauer
    </div>
    <div class="wizardLayer__group">
        <div class="wizardLayer__select">
            <select name="durationSelect" id="durationSelect">
                ${durationOptions}
            </select>
        </div>
    </div>
    <div class="cmsDatePicker__buttonframe">
        <button class="cmsDatePicker__button" id="btn4" onClick="return updateReturnDate(this);">Übernehmen</button>
        <div class="clear"></div>
    </div>
    `,

    durationOption: (name, val, selectedValue) => `<option value="${val}"${selectedValue == val ? ' selected' : ''}>${name}</option>`,

    outer: (header, monthOptions, monthCurrent, days, durations, type) => `
    <!-- calHead -->
    <div class="cmsDatePicker__head">
        ${header}
    </div>
    <!-- calendarFrame -->
    <div class="cmsDatePicker__calframe">
        <!-- monthSelect -->
		<div class="cmsDatePicker-months">
			<button class="cmsDatePicker-months__prev" onclick="datepickerMonthChange(this, -1, ${type});" type="button"></button>
			${monthCurrent}
			<button class="cmsDatePicker-months__next" onclick="datepickerMonthChange(this, 1, ${type});" type="button"></button>
		</div>
        <div class="cmsDatePicker__monthSelect" style='display:none'>
            <select class="monthSelect" id="${type == 1 ? 'depDropdown' : 'retDropdown'}" onchange="get${type == 1 ? 'Departure' : 'Return'}Datepicker(this, true);">
                ${monthOptions}
            </select>
        </div>
        <!-- Month Head -->
        <div class="cmsDatePicker__monthhead">
            <div class="cmsDatePicker__monthday">Mo</div>
            <div class="cmsDatePicker__monthday">Di</div>
            <div class="cmsDatePicker__monthday">Mi</div>
            <div class="cmsDatePicker__monthday">Do</div>
            <div class="cmsDatePicker__monthday">Fr</div>
            <div class="cmsDatePicker__monthday">Sa</div>
            <div class="cmsDatePicker__monthday">So</div>
            <div class="clear"></div>
        </div>
        <!-- Month Days -->
        <div class="cmsDatePicker__month">
            <img src="/_design/kalender-day-frame.png">
            <div class="cmsDatePicker__dayFrame">
                ${days}
                <div class="clear"></div>
            </div>
            <!-- Month Days -->
        </div>
        ${durations}    
    </div>
    `


}

/**
 * Изменяет текущий месяц датапикера
 * @param {node} el - элемент
 * @param {number} diff - в какую сторону изменить месяц (1/-1)
 * @param {number} type - тип календаря (отправление, прибытие)
 * @returns 
 */
function datepickerMonthChange(el, diff, type) {
    const currentEl = el.parentNode.querySelector('.cmsDatePicker-months__current');
    const currentMonth = +currentEl.getAttribute('data-month');
    const currentYear = +currentEl.getAttribute('data-year');

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getUTCMonth() + 1;
    //console.log(diff, currentYear, nowYear, currentMonth, nowMonth)
    if (diff === -1 && currentYear === nowYear && currentMonth <= nowMonth) {
        return
    }

    if (diff === 1 && currentYear === nowYear + 1 && currentMonth >= nowMonth - 1) {
        return
    }

    const resultDate = new Date(currentYear, currentMonth - 1 + diff);
    const resultMonth = resultDate.getMonth();
    const resultYear = resultDate.getFullYear();

    //console.log(type, resultMonth, resultYear);
    if (type == 1) {
        $('#depDropdown').val(`${resultMonth + 1}${resultYear}`);
        $('#depDropdown').change();
    }
    if (type == 2) {
        $('#retDropdown').val(`${resultMonth + 1}${resultYear}`);
        $('#retDropdown').change();
    }

}

/**
 * Рендерит html датапикера
 * @param type {number} - тип: с - по
 * @param month {number} - месяц, год в формате 72021
 * @param duration {number} - выбранная продолжительность, либо -1, если не нужно выводить
 * @return html
 */
function renderDatepicker(type, month = '12021', duration = -1) {
    month = month.toString();
    [all, month, year] = month.match(/(\d{1,2})(\d{4})/);
    const monthOptions = renderMonthOptions(month, year);

    const monthCurrent = searchWizardDateTpl.monthCurrent(searchWizardDateTpl.monthNames[+month - 1], month, year);

    const days = renderDays(month, year, type);

    let durations = '';
    let durationOptions = '';
    if (type == 2) {
        durationOptions = renderDurationOptions(duration)
        durations = searchWizardDateTpl.durations(durationOptions);
    }
    const header = searchWizardDateTpl.header[type - 1];

    return searchWizardDateTpl.outer(header, monthOptions, monthCurrent, days, durations, type)
}

/**
 * Рендерит список месяцев для варианта с select
 * //@param month {number} - стартовый месяц
 * @param year {number} - стартовый год
 * @return html
 */
function renderMonthOptions(month, year) {
    let html = '';
    month = new Date().getMonth() + 1; //Fix: рендерим с текущего месяца
    year = new Date().getFullYear();
    for (let i = month; i <= 12; i++) {
        html += searchWizardDateTpl.monthOptions(searchWizardDateTpl.monthNames[i - 1], i, year)
    }

    for (let i = 1; i <= (13 - month); i++) {
        html += searchWizardDateTpl.monthOptions(searchWizardDateTpl.monthNames[i - 1], i, +year + 1)
    }
    return html
}

/**
 * Рендерит дни календаря
 * @param month {number} - месяц
 * @param year {number} - год
 * @return {html}
 */
function renderDays(month, year, type) {
    let html = '';

    // Кол-во дней в предыдущем месяце
    const lastMonthDate = new Date(year, month - 2);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonthMonth = lastMonthDate.getMonth();

    const lastMonthDays = daysInMonth(lastMonthMonth + 1, lastMonthYear);
    // День недели первого числа текущего месяца
    let dayOfWeekFirst = new Date(year, month - 1, 1).getDay();
    if (!dayOfWeekFirst) {
        dayOfWeekFirst = 7;
    }

    // Предыдущий месяц
    for (let i = lastMonthDays - dayOfWeekFirst + 2; i <= lastMonthDays; i++) {
        html += searchWizardDateTpl.day(i, lastMonthMonth + 1, lastMonthYear, true, type)
    }

    const maxDays = daysInMonth(month, year);
    // Текеущий месяц
    for (let i = 1; i <= maxDays; i++) {
        html += searchWizardDateTpl.day(i, month, year, false, type)
    }


    const nextMonthDate = new Date(year, month);
    const nextMonthYear = nextMonthDate.getFullYear();
    let nextMonthMonth = nextMonthDate.getMonth() + 1;
    nextMonthMonth = nextMonthMonth > 12 ? 1 : nextMonthMonth;

    // Следующий месяц
    for (let i = 1; i <= 7 - (dayOfWeekFirst - 1 + maxDays) % 7; i++) {
        html += searchWizardDateTpl.day(i, nextMonthMonth, nextMonthYear, true, type)
    }
    return html
}

/**
 * Рендерит список опций для продолдительности
 * @param selectedValue {string} - выбранное значение
 * @return {html}
 */
function renderDurationOptions(selectedValue) {
    let html = '';
    searchWizardDateTpl.durationsValues.forEach(item => {
        html += searchWizardDateTpl.durationOption(item.name, item.value, selectedValue)
    })
    return html
}

/**
 * Возращает кол-во дней в месяце
 * @return {number}
 */
const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
