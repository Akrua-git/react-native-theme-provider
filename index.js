import { StyleSheet } from 'react-native';

import { Appearance, useColorScheme } from 'react-native';

//import themes.json
const themes = require('./themes.json')


export function getTheme(modeOverride) {
  //get system theme, then set isDark if theme set to dark
    const scheme = modeOverride ?? Appearance.getColorScheme() ?? 'light';
    const isDark = scheme === 'dark';


  //return the correct pallette based on out isDark const
    const colors = isDark ? themes.dark : themes.light;

    return colors;
};

//create a new style sheet, use default pallette
getTheme.create = (styles, modeOverride) => {
    const colors = getTheme(modeOverride);

  // replace "$colorKey" placeholders with actual color values
    const resolveColors = (obj) => {
        const resolved = {};
        for (const key in obj) {
            let value = obj[key];

            if (typeof value === 'object' && !Array.isArray(value)) {
                // nested style object
                resolved[key] = resolveColors(value);
            }
            else if (typeof key === 'string' && key.startsWith('$')) {
                // bare token key (e.g. $primaryBg)
                const token = key.slice(1);
                const color = colors[token];
                if (!color) continue;

                // pick default property based on token name
                let prop = 'color';
                if (token.toLowerCase().includes('bg')) prop = 'backgroundColor';
                else if (token.toLowerCase().includes('border')) prop = 'borderColor';
                else if (token.toLowerCase().includes('accent')) prop = 'color';

                resolved[prop] = color;
            }
            else if (typeof value === 'string' && value.startsWith('$')) {
                // value placeholder (e.g. color: '$primaryText')
                const token = value.slice(1);
                resolved[key] = colors[token] ?? value;
            } else {
                resolved[key] = value;
            }
        }

        return resolved;
    };

    const base = resolveColors(styles);
    return StyleSheet.create(base);
};
