import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {InteractComponent} from './interact/interact.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,

    },
    {
        path: 'interact', component: InteractComponent,

    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
