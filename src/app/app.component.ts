import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { BattlefieldComponent } from './components/battlefield/battlefield.component';
import { ToastComponent } from './shared/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BattlefieldComponent, FooterComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = '5e-encounter';
}
