# ReminderWearIonic

---

## Pour primeng colorpicker

1. npm install primeng --save  
2. npm install @angular/animations --save  
3. npm install font-awesome --save  
4. Add this to app.module.ts file:  
    
        import {BrowserModule} from '@angular/platform-browser';  
        import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
        imports: [
            BrowserModule,
            BrowserAnimationsModule,
            //…
        ],

5. open this file:  
node_modules/@ionic/app-scripts/config/copy.config.js

6. add this code to copy.config.js file

        copyPrimeng: {
        src: ['{{ROOT}}/node_modules/primeng/resources/themes/omega/theme.css', '{{ROOT}}/node_modules/primeng/resources/primeng.min.css', '{{ROOT}}/node_modules/font-awesome/css/font-awesome.min.css'],
        dest: '{{BUILD}}/assets/css'
        },
        copyFontAwesome: {
        src: ['{{ROOT}}/node_modules/font-awesome/fonts/**/*'],
        dest: “{{BUILD}}/assets/fonts”
        }

7. Add these file links to index.html file:

---