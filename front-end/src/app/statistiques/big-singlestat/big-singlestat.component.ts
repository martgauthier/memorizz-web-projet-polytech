import {Component, Input, OnInit} from "@angular/core";
import {
  AllDifficultiesData,
  createDefaultDataPerDifficultyForSingleStat,
  FullDataForSingleStat
} from "../../../models/stats-data.model";
import {STAT_TITLE_AND_DESCRIPTION_PER_STAT_TYPE, StatistiquesService, SUFFIXES_PER_STAT_TYPE} from "../../../services/statistiques/statistiques.service";
import {BehaviorSubject} from "rxjs";
import {HelpIconComponent} from "../help-icon/help-icon.component";

@Component({
  selector: 'app-big-singlestat',
  templateUrl: './big-singlestat.component.html',
  styleUrls: ['./big-singlestat.component.scss']
})
export class BigSinglestatComponent implements OnInit {
  @Input({required: true}) public statType: "errorsPerGame" | "timeToDiscoverFullPair" | "preferredDifficultyMode" | "errorPercentageOnWholeGame" | "meanGameDuration" = "errorsPerGame";
  /**
   * represents full data to be shown in this whole component.
   * it is potentially undefined, because it needs to wait for "OnChanges" component state to be defined
   */
  public statData?: FullDataForSingleStat;

  public statPercentageSuffix: string="";

  public duration: number=1;

  constructor(private statsService: StatistiquesService) {}

  ngOnInit() {
    let dataToSubscribeTo: BehaviorSubject<FullDataForSingleStat> = this.statsService.data[this.statType];

    dataToSubscribeTo.subscribe((data) => {
      this.statData = data;
      this.statPercentageSuffix = SUFFIXES_PER_STAT_TYPE[data.statType].statPercentageSuffix;
    });

    this.statsService.duration$.subscribe((duration) => {
      this.duration=duration;
    })
  }

  getOverallPercentage() {
    let nowValuesSum=0;
    let lastTimeValuesSum=0;
    let totalGamesNumber=0;
    for (let difficultyKey in this.statData?.difficulty) {
      let dataForThisDifficulty=this.statData.difficulty[difficultyKey as keyof AllDifficultiesData]

      nowValuesSum+=dataForThisDifficulty.nowValue * dataForThisDifficulty.gamesQuantity;
      lastTimeValuesSum+=dataForThisDifficulty.lastTimeValue * dataForThisDifficulty.gamesQuantity;//moyenne pondérée
      totalGamesNumber+=dataForThisDifficulty.gamesQuantity;
    }
    let meanNowValues=nowValuesSum/totalGamesNumber;
    let meanLastTimeValues=lastTimeValuesSum/totalGamesNumber;

    let overallPercentage = Math.round((100*(meanNowValues - meanLastTimeValues)/meanLastTimeValues));

    return (overallPercentage<0 ? "" : "+") + overallPercentage.toFixed(1);
  }

  onMonitoringClick() {
    this.statsService.setSelectedStat(this.statType);
  }

  protected readonly HelpIconComponent = HelpIconComponent;
  protected readonly createDefaultDataPerDifficultyForSingleStat = createDefaultDataPerDifficultyForSingleStat;
  protected readonly STAT_TITLE_AND_DESCRIPTION_PER_STAT_TYPE = STAT_TITLE_AND_DESCRIPTION_PER_STAT_TYPE;
}
