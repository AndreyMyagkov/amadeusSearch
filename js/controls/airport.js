const airports = [
    {
        countryName: 'Deutschland',
        groups: [
            {
                name: "Ost",
                code: "_",
                items: [
                    {
                        name: "Berlin Brandenburg",
                        code: "BER"
                    },
                    {
                        name: "Dresden",
                        code: "DRS"
                    },
                    {
                        name: "Erfurt Weimar",
                        code: "ERF"
                    },
                    {
                        name: "Heringsdorf",
                        code: "HDF"
                    },
                    {
                        name: "Leipzig Halle",
                        code: "LEJ"
                    }
                ]
            },
            {
                name: "West",
                code: "_",
                items: [
                    {
                        name: "Dortmund",
                        code: "DTM"
                    },
                    {
                        name: "Düsseldorf",
                        code: "DUS"
                    },
                    {
                        name: "Frankfurt",
                        code: "FRA"
                    },
                    {
                        name: "Frankfurt Hahn",
                        code: "HHN"
                    },
                    {
                        name: "Kassel Calden",
                        code: "KSF"
                    },
                    {
                        name: "Köln Bonn",
                        code: "CGN"
                    },
                    {
                        name: "Münster Osnabrück",
                        code: "FMO"
                    },
                    {
                        name: "Niederrhein Weeze",
                        code: "NRN"
                    },
                    {
                        name: "Paderborn",
                        code: "PAD"
                    },
                    {
                        name: "Saarbrücken",
                        code: "SCN"
                    }
                ]
            },
            {
                name: "Nord",
                code: "_",
                items: [
                    {
                        name: "Bremen",
                        code: "BRE"
                    },
                    {
                        name: "Hamburg",
                        code: "HAM"
                    },
                    {
                        name: "Hannover",
                        code: "HAJ"
                    },
                    {
                        name: "Rostock Laage",
                        code: "RLG"
                    },
                    {
                        name: "Schwerin",
                        code: "SZW"
                    }
                ]
            },
            {
                name: "Süd",
                code: "_",
                items: [
                    {
                        name: "Friedrichshafen",
                        code: "FDH"
                    },
                    {
                        name: "Karlsruhe",
                        code: "FKB"
                    },
                    {
                        name: "Memmingen",
                        code: "FMM"
                    },
                    {
                        name: "München",
                        code: "MUC"
                    },
                    {
                        name: "Nürnberg",
                        code: "NUE"
                    },
                    {
                        name: "Stuttgart",
                        code: "STR"
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
                code: "_",
                items: [
                    {
                        name: "Brüssel",
                        code: "BRU"
                    },
                    {
                        name: "Charleroi",
                        code: "CRL"
                    },
                    {
                        name: "Lüttich",
                        code: "LGG"
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
                code: "_",
                items: [
                    {
                        name: "Strasbourg",
                        code: "SXB"
                    },
                    {
                        name: "Metz Nancy",
                        code: "ETZ"
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
                code: "_",
                items: [
                    {
                        name: "Amsterdam",
                        code: "AMS"
                    },
                    {
                        name: "Eindhoven",
                        code: "EIN"
                    },
                    {
                        name: "Enschede",
                        code: "ENS"
                    },
                    {
                        name: "Groningen",
                        code: "GRQ"
                    },
                    {
                        name: "Maastricht",
                        code: "MST"
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
                code: "_",
                items: [
                    {
                        name: "Krakau",
                        code: "KRK"
                    },
                    {
                        name: "Warschau",
                        code: "WAW"
                    },
                    {
                        name: "Breslau",
                        code: "WRO"
                    },
                    {
                        name: "Posen",
                        code: "POZ"
                    },
                    {
                        name: "Stettin",
                        code: "SZZ"
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
                code: "_",
                items: [
                    {
                        name: "Basel EuroAirport",
                        code: "BSL"
                    },
                    {
                        name: "Basel-Mulhouse",
                        code: "MLH"
                    },
                    {
                        name: "Bern",
                        code: "BRN"
                    },
                    {
                        name: "Genf",
                        code: "GVA"
                    },
                    {
                        name: "Lugano",
                        code: "LUG"
                    },
                    {
                        name: "Zürich",
                        code: "ZRH"
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
                code: "_",
                items: [
                    {
                        name: "Graz",
                        code: "GRZ"
                    },
                    {
                        name: "Innsbruck",
                        code: "INN"
                    },
                    {
                        name: "Klagenfurt",
                        code: "KLU"
                    },
                    {
                        name: "Linz",
                        code: "LNZ"
                    },
                    {
                        name: "Salzburg",
                        code: "SZG"
                    },
                    {
                        name: "Wien",
                        code: "VIE"
                    }
                ]
            }
        ]
    }
];

/**
 * Класс уповления контролом выбора аэропортов
 * клик по чек: setValue, setAlLprocess
 * клик по All: setAllprocess
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
        airports.forEach((country, i) => {
            let groupHTML = '';
            country.groups.forEach(group => {
                let itemsHTML = '';
                group.items.forEach(item => {
                    itemsHTML += this.renderItem(item.name, item.code)
                })
                
                groupHTML += this.renderGroup(group.name, itemsHTML)
            })
            countryHtml += this.renderCountry(country.countryName, groupHTML, i === 0);
        })
        html += countryHtml;
        //console.log(html)
        this.$root.innerHTML = html

    }
    addEventListener() {
        document.querySelectorAll('.js-ibe-airport__ch-item').forEach(_ => _.addEventListener('change', e => this.processChangeItem(e)))
        document.querySelectorAll('.js-ibe-airport__ch-group').forEach(_ => _.addEventListener('change', e => this.processChangeGroup(e)))
    }
    processChangeItem(e) {
        const $root = e.target.closest('.js-ibe-airport-col');
        const $groupCh = $root.querySelector('.js-ibe-airport__ch-group');
        const $itemsCh = $root.querySelectorAll('.js-ibe-airport__ch-item');
        const $itemsChChecked = $root.querySelectorAll('.js-ibe-airport__ch-item:checked');

        if ($itemsChChecked.length < $itemsCh.length) {
            $groupCh.checked = false
        } else {
            $groupCh.checked = true
        }

        this.onChange();
    }
    processChangeGroup(e) {
        const $root = e.target.closest('.js-ibe-airport-col');
        const $groupCh = e.target;
        const $itemsCh = $root.querySelectorAll('.js-ibe-airport__ch-item');

        $itemsCh.forEach(_ => _.checked = !!$groupCh.checked);
        this.onChange();
    }

    getValue() {
        const value = [];
        const $AllitemsCh = this.$root.querySelectorAll('.js-ibe-airport__ch-item:checked');
        $AllitemsCh.forEach(_ => {
            _.checked && value.push({
                name: _.dataset.name,
                code: _.value
            })
        })
        return value
    }
    onChange() {
        const value = this.getValue();
        _IBESearch.setAirports(value);
    }
    renderCountry(countryName, groups, open) {
        return `
        <details class="ibe-details" ${open ? 'open' : ''}>
            <summary class="ibe-summary">${countryName}</summary>
            <div class="row">
                ${groups}
            </div>
        </details>
        `
    }
    renderGroup(groupName, items) {
        return `
        <div class="col-6 col-md-3 col-lg-3 js-ibe-airport-col">
            <div class="ibe-airport__group">
                <label class="ibe-airport__label">
                    <input type="checkbox" value="all" class="ibe-airport__checkbox js-ibe-airport__ch-group"><span>${groupName}</span>
                </label>
            </div>
            <div class="ibe-airport__list">
                ${items}
            </div>
        </div>
        `
    }
    renderItem(name, code) {
        return `
        <div class="ibe-airport__item">
            <label class="ibe-airport__label">
                <input type="checkbox" value="${code}" class="ibe-airport__checkbox js-ibe-airport__ch-item" data-name="${name}"><span>${name}</span>
            </label>
        </div>
        `
    }

}