import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {InteractComponent} from './interact/interact.component';
import {PlayComponent} from "./play/play.component";

const routes: Routes = [
    {
        path: '', component: AppComponent,

    },
    {
        path: 'interact', component: InteractComponent,

    },
    {
        path: 'play', component: PlayComponent,

    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
