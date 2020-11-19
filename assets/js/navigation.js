(function init() {
    
    const mainNavigation = document.querySelector("#menu__main")
    const btnToggleNavigation = document.querySelector("#btn-toggle-navigation")

    btnToggleNavigation.addEventListener('click', handleToggleNavigationClick)


    function handleToggleNavigationClick() {
        mainNavigation.classList.toggle('menu--active')
        btnToggleNavigation.classList.toggle('opened')
    }
    
})()