import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';

import { TranslateEnumsPipe } from './pipes/translate-enums.pipe';
import { TranslateDurationPipe } from './pipes/translate-duration.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent, TranslateEnumsPipe, TranslateDurationPipe],
  exports: [LoaderComponent, TranslateEnumsPipe, TranslateDurationPipe],
  providers: [TranslateEnumsPipe, TranslateDurationPipe]
})
export class SharedModule {}
