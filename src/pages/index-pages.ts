import { ListMasterPage } from './list-master/list-master';
import { SearchPage } from './search/search';
import { SettingsPage } from './settings/settings';
import { TabsPage } from './tabs/tabs';
import { TutorialPage } from './tutorial/tutorial';
import { StorePage } from './store/store';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = TutorialPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = ListMasterPage;
export const Tab2Root = SearchPage;
export const Tab3Root = SettingsPage;

export { CardsPage } from './cards/cards';
export { ContentPage } from './content/content';
export { ItemCreatePage } from './item-create/item-create';
export { ItemDetailPage } from './item-detail/item-detail';
export { ListMasterPage } from './list-master/list-master';
export { LoginPage } from './login/login';
export { MapPage } from './map/map';
export { MenuPage } from './menu/menu';
export { SearchPage } from './search/search';
export { SettingsPage } from './settings/settings';
export { SignupPage } from './signup/signup';
export { TabsPage } from './tabs/tabs';
export { TutorialPage } from './tutorial/tutorial';
export { WelcomePage } from './welcome/welcome';
export { StorePage } from './store/store';
export { CatalogPage } from './catalog/catalog';
export { CatalogProductsPage } from './catalog-products/catalog-products';
export { ProductDetailsPage } from './product-details/product-details';
