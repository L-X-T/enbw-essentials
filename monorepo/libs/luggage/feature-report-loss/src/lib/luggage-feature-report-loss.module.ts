import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuggageDomainModule } from '@flight-workspace/luggage/domain';
import { ReportLossComponent } from './report-loss.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, LuggageDomainModule, RouterModule.forChild([{ path: '', component: ReportLossComponent }])],
  declarations: [ReportLossComponent],
  exports: [ReportLossComponent]
})
export class LuggageFeatureReportLossModule {}
