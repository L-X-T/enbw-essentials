import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuggageDomainModule } from '@flight-workspace/luggage/domain';
import { ReportLossComponent } from './report-loss.component';
import { RouterModule } from '@angular/router';
import { LuggageUiCardModule } from '@flight-workspace/luggage/ui-card';

@NgModule({
  imports: [CommonModule, LuggageDomainModule, LuggageUiCardModule, RouterModule.forChild([{ path: '', component: ReportLossComponent }])],
  declarations: [ReportLossComponent],
  exports: [ReportLossComponent]
})
export class LuggageFeatureReportLossModule {}
