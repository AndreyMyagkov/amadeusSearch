const airports = [
    {
        countryName: 'Deutschland',
        groups: [
            {
                name: "Ost",
                value: "_",
                items: [
                    {
                        name: "Berlin Brandenburg",
                        value: "BER"
                    },
                    {
                        name: "Dresden",
                        value: "DRS"
                    },
                    {
                        name: "ERF",
                        value: "Erfurt Weimar"
                    },
                    {
                        name: "HDF",
                        value: "Heringsdorf"
                    },
                    {
                        name: "LEJ",
                        value: "Leipzig Halle"
                    }
                ]
            },
            {
                name: "West",
                value: "_",
                items: [
                    {
                        name: "Dortmund",
                        value: "DTM"
                    },
                    {
                        name: "Düsseldorf",
                        value: "DUS"
                    },
                    {
                        name: "FRA",
                        value: "Frankfurt"
                    },
                    {
                        name: "Frankfurt Hahn",
                        value: "HHN"
                    },
                    {
                        name: "Kassel Calden",
                        value: "KSF"
                    },
                    {
                        name: "Köln Bonn",
                        value: "CGN"
                    },
                    {
                        name: "Münster Osnabrück",
                        value: "FMO"
                    },
                    {
                        name: "Niederrhein Weeze",
                        value: "NRN"
                    },
                    {
                        name: "Paderborn",
                        value: "PAD"
                    },
                    {
                        name: "Saarbrücken",
                        value: "SCN"
                    }
                ]
            },
            {
                name: "Nord",
                value: "_",
                items: [
                    {
                        name: "Bremen",
                        value: "BRE"
                    },
                    {
                        name: "Hamburg",
                        value: "HAM"
                    },
                    {
                        name: "Hannover",
                        value: "HAJ"
                    },
                    {
                        name: "Rostock Laage",
                        value: "RLG"
                    },
                    {
                        name: "Schwerin",
                        value: "SZW"
                    }
                ]
            },
            {
                name: "Süd",
                value: "_",
                items: [
                    {
                        name: "Friedrichshafen",
                        value: "FDH"
                    },
                    {
                        name: "Karlsruhe",
                        value: "FKB"
                    },
                    {
                        name: "Memmingen",
                        value: "FMM"
                    },
                    {
                        name: "München",
                        value: "MUC"
                    },
                    {
                        name: "Nürnberg",
                        value: "NUE"
                    },
                    {
                        name: "Stuttgart",
                        value: "STR"
                    }
                ]
            }

        ]
    },
    {
        countryName: 'Belgien',
        groups: [
            {
                name: "alle",
                value: "_",
                items: [
                    {
                        name: "Brüssel",
                        value: "BRU"
                    },
                    {
                        name: "Charleroi",
                        value: "CRL"
                    },
                    {
                        name: "Lüttich",
                        value: "LGG"
                    }
                ]
            }
        ]
    },
    {
        countryName: 'Frankreich',
        groups: [
            {
                name: "alle",
                value: "_",
                items: [
                    {
                        name: "Strasbourg",
                        value: "SXB"
                    },
                    {
                        name: "Metz Nancy",
                        value: "ETZ"
                    }
                ]
            }
        ]
    },
    {
        countryName: 'Niederlande',
        groups: [
            {
                name: "alle",
                value: "_",
                items: [
                    {
                        name: "Amsterdam",
                        value: "AMS"
                    },
                    {
                        name: "Eindhoven",
                        value: "EIN"
                    },
                    {
                        name: "Enschede",
                        value: "ENS"
                    },
                    {
                        name: "Groningen",
                        value: "GRQ"
                    },
                    {
                        name: "Maastricht",
                        value: "MST"
                    }
                ]
            }
        ]
    },
    {
        countryName: 'Polen',
        groups: [
            {
                name: "alle",
                value: "_",
                items: [
                    {
                        name: "Krakau",
                        value: "KRK"
                    },
                    {
                        name: "Warschau",
                        value: "WAW"
                    },
                    {
                        name: "Breslau",
                        value: "WRO"
                    },
                    {
                        name: "Posen",
                        value: "POZ"
                    },
                    {
                        name: "Stettin",
                        value: "SZZ"
                    }
                ]
            }
        ]
    },
    {
        countryName: 'Schweiz',
        groups: [
            {
                name: "alle",
                value: "_",
                items: [
                    {
                        name: "Basel EuroAirport",
                        value: "BSL"
                    },
                    {
                        name: "Basel-Mulhouse",
                        value: "MLH"
                    },
                    {
                        name: "Bern",
                        value: "BRN"
                    },
                    {
                        name: "Genf",
                        value: "GVA"
                    },
                    {
                        name: "Lugano",
                        value: "LUG"
                    },
                    {
                        name: "Zürich",
                        value: "ZRH"
                    }
                ]
            }
        ]
    },
    {
        countryName: 'Österreich',
        groups: [
            {
                name: "alle",
                value: "_",
                items: [
                    {
                        name: "Graz",
                        value: "GRZ"
                    },
                    {
                        name: "Innsbruck",
                        value: "INN"
                    },
                    {
                        name: "Klagenfurt",
                        value: "KLU"
                    },
                    {
                        name: "Linz",
                        value: "LNZ"
                    },
                    {
                        name: "Salzburg",
                        value: "SZG"
                    },
                    {
                        name: "Wien",
                        value: "VIE"
                    }
                ]
            }
        ]
    }
];

/**
 * Класс уповления контролом выбора аэропортов
 */
class AirportControl {
    constructor(selector) {
        this.$root = document.querySelector(selector);
        this.init();
    }
    init() {
        this.render();
        this.addEventListener();
    }
    render() {
        let html = '';
        let countryHtml = '';
        airports.forEach(country => {
            let groupHTML = '';
            country.groups.forEach(group => {
                let itemsHTML = '';
                group.items.forEach(item => {
                    itemsHTML += this.renderItem(item.name, item.value)
                })
                
                groupHTML += this.renderGroup(group.name, itemsHTML)
            })
            countryHtml += this.renderCountry(country.countryName, groupHTML);
        })
        html += countryHtml;
        //console.log(html)
        this.$root.innerHTML = html

    }
    addEventListener() {

    }
    renderCountry(countryName, groups) {
        return `
        <details class="ibe-details">
            <summary class="ibe-summary">${countryName}</summary>
            <div class="row">
                ${groups}
            </div>
        </details>
        `
    }
    renderGroup(groupName, items) {
        return `
        <div class="col-6 col-md-3 col-lg-3">
            <div class="ibe-airport__group">
                <label class="ibe-airport__label">
                    <input type="checkbox" value="all" class="ibe-airport__checkbox"><span>${groupName}</span>
                </label>
            </div>
            <div class="ibe-airport__list">
                ${items}
            </div>
        </div>
        `
    }
    renderItem(name, value) {
        return `
        <div class="ibe-airport__item">
            <label class="ibe-airport__label">
                <input type="checkbox" value="${value}" class="ibe-airport__checkbox"><span>${name}</span>
            </label>
        </div>
        `
    }

}