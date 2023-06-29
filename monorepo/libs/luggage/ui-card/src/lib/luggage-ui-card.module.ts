import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuggageDomainModule } from '@flight-workspace/luggage/domain';

@NgModule({
  imports: [CommonModule, LuggageDomainModule]
})
export class LuggageUiCardModule {}
