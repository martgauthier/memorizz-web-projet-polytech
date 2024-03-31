import {Component, Input, OnInit} from "@angular/core";
import {
  createDefaultDataPerDifficultyForSingleStat,
  FullDataForSingleStat
} from "../../../models/stats-data.model";
import {StatistiquesService, SUFFIXES_PER_STAT_TYPE} from "../../../services/statistiques/statistiques.service";
import {BehaviorSubject} from "rxjs";
import {HelpIconComponent} from "../help-icon/help-icon.component";

@Component({
  selector: 'app-big-singlestat',
  templateUrl: './big-singlestat.component.html',
  styleUrls: ['./big-singlestat.component.scss']
})
export class BigSinglestatComponent implements OnInit {
  @Input({required: true}) public statType: "errorsPerGame" | "timeToDiscoverFullPair" | "errorPercentageOnWholeGame" | "meanGameDuration" = "errorsPerGame";
  /**
   * represents full data to be shown in this whole component.
   * it is potentially undefined, because it needs to wait for "OnChanges" component state to be defined
   */
  public statData?: FullDataForSingleStat;

  public statPercentageSuffix: string="";

  constructor(private statsService: StatistiquesService) {}

  ngOnInit() {
    let dataToSubscribeTo: BehaviorSubject<FullDataForSingleStat> = this.statsService.data[this.statType + "$"];

    dataToSubscribeTo.subscribe((data) => {
      this.statData = data;
    });
    this.statPercentageSuffix = SUFFIXES_PER_STAT_TYPE[this.statData!.statType].statPercentageSuffix;
  }

  getEvolutionPercentageString(): string {
    if(this.statData==null) {
      return "...";
    }
    else {
      let percentage=100*(this.statData.difficulty.overall.nowValue-this.statData.difficulty.overall.lastTimeValue)/this.statData.difficulty.overall.nowValue;
      return (percentage<0 ? "-" : "+") + Math.round(percentage).toString();
    }
  }

  protected readonly HelpIconComponent = HelpIconComponent;
  protected readonly createDefaultDataPerDifficultyForSingleStat = createDefaultDataPerDifficultyForSingleStat;
}
