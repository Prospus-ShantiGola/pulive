import React from 'react';
import { NavLink } from 'react-router-dom';

const Menu = ( props ) => {
    let menu = props.menu;

    let class_name = 'icon-sm '+ menu.icon_class;
    let menuInner, ai_class = menu.ai_class;
    if(props.active_url_path.indexOf(menu.src) > -1) {
        ai_class = ai_class + ' active';
    }
    if(menu.src) {
        menu.src = menu.src.replace('/', '');
        menuInner = getLinkWithSrc(menu, class_name)
    } else {
        menuInner = getLinkWithoutSrc(menu, class_name)
    }
    return (<li className={ai_class}>{menuInner}</li>)
}

function getLinkWithSrc(menu, class_name) {
    let allowRedirectMenus = ['Classes', 'Calendar', 'Resources'];
    if(allowRedirectMenus.indexOf(menu.menu_title) > -1) {
        let href = domainUrl + menu.menu_title.toLowerCase();
        return <a href={href}><i className={class_name}></i><span className="menu-title">{menu.menu_title}</span></a>
    }
    return <NavLink to={menu.src}><i className={class_name}></i><span className="menu-title">{menu.menu_title}</span></NavLink>
}
function getLinkWithoutSrc(menu, class_name) {
    let href = "javascript:void(0)";
    if(menu.allow_click) {
        href="#login";
    }
    return <a href={href}><i className={class_name}></i><span className="menu-title">{menu.menu_title}</span></a>
}
export default Menu;
