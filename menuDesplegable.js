// Para que sea desplegable con jquery
function makeItRecizable() {
    //Cuando el dom esta cargado:
    $(document).ready(function() {
        //Seleccionamos todo lo qye trenga la calse menu y lo escondemos 
        $('.menus').hide(); 
        
        //Cuando se le haga clic a cualquier p, todos los siguientes elementos de los p que tengan la calse menu les aplicamos .slideToggle() y que ocurra en 1 seg
        $('p').click(function(){
            $(this).next('.menus').slideToggle(1000);  // Alterna entre mostrar u ocultar el siguiente menú
        });
    });
}

// Creando la calse myLink
class myLink {
    // Declaración de propiedades privadas
    #name;
    #url;
    #mode;

    constructor(name, url, mode) {
        this.name = name; // Usa los setters para validación
        this.url = url;
        this.mode = mode;
    }

    // Getter y setter para "name"
    get name() {
        return this.#name;
    }
    set name(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error("El nombre debe ser una cadena de texto válida.");
        }
        this.#name = value;
    }

    // Getter y setter para "url"
    get url() {
        return this.#url;
    }
    set url(value) {
        if (typeof value !== 'string') {
            throw new Error("La URL debe ser una cadena válida STRING");
        }
        this.#url = value;
    }

    // Getter y setter para "mode"
    get mode() {
        return this.#mode;
    }
    set mode(value) {
        if (value === 'link' || value === 'event') {
            this.#mode = value;
        } else {
            throw new Error("El valor introducido debe ser 'link' o 'event'.");
        }
    }
}


// Creamos la clase myCategory
class myCategory {
    #name;

    constructor(name) {
        this.name = name;
        this.links = [];    // Array de objetos links.
    }

    // Getter y setter para "name"
    get name() {
        return this.#name;
    }
    set name(value) {
        if (typeof value !== 'string') {
            throw new Error("El nombre debe ser una cadena de texto válida y medir al menos 1.");
        }
        this.#name = value;
    }


    // Metodo para añair links a cada categoria.
    addLink(link) {
        if (link instanceof myLink) {
            this.links.push(link);
        } else {
            throw new Error("Debes insertar una instancia de tipo LINK.");
        }
    }
}


// Creamos la calse my myMenu
class myMenu {
    
    // Declaración de propiedades privadas
    #name;
    #menuContainer;
    #position;
    #categories;

    constructor(name, menuContainer, position /* 'h' o 'v' */) {
        this.#name = name;             
        this.#menuContainer = menuContainer;
        this.#position = position;
        this.#categories = [];  // Array de objetos myCategory
    }

    // Getter y Setter para "name"
    get name() {
        return this.#name;
    }
    set name(newName) {
        this.#name = newName;
    }

    // Getter y Setter para "menuContainer"
    get menuContainer() {
        return this.#menuContainer;
    }
    set menuContainer(newMenuContainer) {
        this.#menuContainer = newMenuContainer;
    }

    // Getter y Setter para "position"
    get position() {
        return this.#position;
    }
    set position(newPosition) {
        if (newPosition === 'h' || newPosition === 'v') {
            this.#position = newPosition;
        } else {
            throw new Error("La posición debe ser 'h' o 'v'.");
        }
    }

    // Getter y Setter para "categories"
    get categories() {
        return this.#categories;
    }
    set categories(newCategories) {
        if (Array.isArray(newCategories)) {
            this.#categories = newCategories;  
        } else {
            throw new Error("Categories debe ser un ARRAY.");
        }
    }



    // Método para añadir una categoría nueva a la lista de myMenu
    addCategory(category) {
        // Solo si es una instancia de myCategory, controlamos que no metan nada extraño
        if (category instanceof myCategory) {
            this.#categories.push(category);  
        } else {
            throw new Error("Debes insertar una instancia de tipo CATEGORY.");
        }
    }

    // Método render, que imprime en la web todo nuestro menú
    render() {

        // Vaciamos el contenedor que ha pasado el cliente para evitar problemas
        $(this.#menuContainer).empty();

        // Crea el UL principal donde se creará el menú
        const $menu = $('<ul>').addClass('luli');

        // Por cada categoría creamos:
        this.#categories.forEach(category => {

            // Un LI con un título P
            const $categoryItem = $('<li>').addClass('luli');
            const $categoryTitle = $('<p>').text(category.name).addClass('p');

            // Por cada categoría creamos un UL de la clase menus
            const $linkList = $('<ul>').addClass('menus').addClass('luli');
            // Por cada link creamos un LI y un A/Anchor:
            category.links.forEach(link => {
                const $linkItem = $('<li>').addClass('luli');
                const $linkAnchor = $('<a>');

                // Solo si el modo del link está en 'link':
                if (link.mode == "link") {
                    // Tomamos el A y le metemos la URL aparte del texto de este A
                    $linkAnchor.attr('href', link.url)  
                        .text(link.name);

                // Si no es 'link' y es 'event':
                } else if (link.mode == "event") {

                    // Lógica para los eventos
                    // Se crea un enlace con el nombre que se le ha mandado 
                    $linkAnchor.text(link.name).on('click', function(event) {
                        event.preventDefault();  // Prevenimos que al hacer clic encima haga nada por defecto con preventDefault();

                        // Crear un evento personalizado por cada A de modo 'event'
                        const customEvent = new CustomEvent("linkEvent", {
                            detail: {
                                name: link.name,  // Aquí se pasa 'name' como propiedad dentro de 'detail'
                            }
                        });
                        document.dispatchEvent(customEvent);  // Despachamos el evento personalizado
                    });
                }

                // Añadimos el linkItem que es el <li> el link
                $linkItem.append($linkAnchor);

                // Añadimos a linkList que es el <ul> principal el <li> linkItem
                $linkList.append($linkItem);
            });

            // Añadimos a categoryItem que es: el <li> de las listas de menú el título y el link
            $categoryItem.append($categoryTitle, $linkList);

            // Añadimos al contenedor principal la categoría
            $menu.append($categoryItem);
        });


    // En esta parte añadimos al contenedor ya creado del HTML el menú que hemos creado aquí
    $(this.#menuContainer).append($menu);

    // Como utilizo el display flex, solo lo aplicamos cuando quiere que esté en horizontal. 
    // Si es una v estará en vertical por defecto, o sea si es cualquier cosa que no sea una "h" estará en vertical
    if (this.#position === 'h') {
        $menu.css({ display: 'flex' });
    }
}
}




class myMenuStyles {
    #menuContainer;
    constructor(menuContainer) { // Se le pasa el contenedor en formato "ID" del menú
        this.#menuContainer = menuContainer;  
    }

    // Método para cambiar el color de fondo del menú
    setBackgroundColor(color) {
        $(this.#menuContainer).css('background-color', color);
    }

    // Método para cambiar el color de texto de los links
    setLinkColor(color) {
        $(this.#menuContainer).find('a').css('color', color);
    }

    // Método para cambiar el tamaño de las letras de los títulos de las categorías
    setCategoryFontSize(size) {
        $(this.#menuContainer).find('p').css('font-size', size);
    }

    // Método para aplicar un borde a cada li de cada categoría
    setCategoryBorder(border) {
        $(this.#menuContainer).find('li').css('border', border);
    }

    // Método para modificar el padding de los li del menú
    setMenuItemPadding(padding) {
        $(this.#menuContainer).find('li').css('padding', padding);
    }

    // Método para modificar el color de fondo de los li del menú al hover
    setHoverBackgroundColor(color) {
        $(this.#menuContainer).find('li').hover(
            function () {
                $(this).css('background-color', color);
            },
            function () {
                $(this).css('background-color', ''); 
            }
        );
    }
}










///////////////////////////////////////////////////////////// LO QUE HARA EL CLIENTE /////////////////////////////////////////////////////////////

// Listener para escuchar el evento 'linkEvent'
document.addEventListener('linkEvent', (event) => {
    switch(event.detail.name) {  // Usamos 'name' porque es lo que hemos definido en el evento
        case "Evento Especial": 
            // Acción que se ejecutará cuando el evento 'Evento Especial' sea disparado
            alert("aUE LO KURA 1");
            break;
        case "Evento EspecialDOS":
            // Acción para el evento 'Evento EspecialDOS'
            alert("YEEEY");
            break;
    }
});


makeItRecizable();

const link1 = new myLink('Google', 'https://www.google.com', 'link');
const link2 = new myLink('Facebook', 'https://www.facebook.com', 'link');
const link3 = new myLink('Evento Especial', '', 'event');
const link4 = new myLink('Evento EspecialDOS', '', 'event');


const category1 = new myCategory('Buscadores');
category1.addLink(link1);  
category1.addLink(link2);  

const category2 = new myCategory('Eventos');
category2.addLink(link3);  

const category3 = new myCategory('Más Eventos');
category3.addLink(link4); 


const menu = new myMenu('Menú Principal', '#menu-container', 'h');
menu.addCategory(category1);
menu.addCategory(category2);
menu.addCategory(category3);


menu.render();


const menuStyles = new myMenuStyles('#menu-container');


menuStyles.setBackgroundColor('#f5f5f5'); // Fondo claro
menuStyles.setLinkColor('#007BFF'); // Color azul para los enlaces
menuStyles.setCategoryFontSize('18px'); // Tamaño de letra para las categorías
menuStyles.setCategoryBorder('1px solid #ddd'); // Bordes sutiles en las categorías
menuStyles.setMenuItemPadding('10px 20px'); // Espaciado interno en cada ítem
menuStyles.setHoverBackgroundColor('#e9ecef'); // Fondo al pasar el ratón






/*
// Si queremos que sea responsive:

let minWidth = 0;

// Calcula el ancho mínimo basado en las categorías
for (let i = 0; i < menu.categories.length; i++) {
    minWidth += 180;
}

// Escucha los cambios en el tamaño de la ventana
window.addEventListener('resize', () => {
    if (window.innerWidth <= minWidth) { 
        console.log("Estoy aquí - Cambiando a vertical");
        if (menu.position === "h") {    
            menu.position = "v"; 
            menu.render();    
            makeItRecizable();                 
        }
    } else {
        console.log("Estoy aquí - Cambiando a horizontal");
        if (menu.position === "v") {    
            menu.position = "h"; 
            menu.render();    
            makeItRecizable();                 
        }
    }
});

// Ejecuta también al cargar la página, en caso de que el tamaño ya cumpla la condición
if (window.innerWidth <= minWidth) { 
    console.log("Estoy aquí al cargar - Vertical");
    if (menu.position === "h") {    
        menu.position = "v";  
        menu.render();    
        makeItRecizable();                
    }
} else {
    console.log("Estoy aquí al cargar - Horizontal");
    if (menu.position === "v") {    
        menu.position = "h";  
        menu.render();    
        makeItRecizable();                
    }
}
*/
