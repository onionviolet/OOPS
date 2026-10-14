# Immortality Idle: system inventory

Scope: every distinct family located in the available source snapshot, followed by a complete mechanical locator appendix. Inventory is not semantic reading of every row. Missing executables/unseen builds cannot be exhaustively inventoried. NEW means undocumented at this depth in the inspected prior dossiers.

| System/subsystem | Where | Size signal | Prior/new coverage |
|---|---|---|---|
| Main loop/clocks/audio | main-loop.service.ts | service line count appendix | prior/new architecture |
| State/save/layout/avatar | game-state.service.ts | 21 panels | prior/new persistence |
| Activities/schedule/triggers | activity.service.ts/activity.ts | 109 activity IDs per prior follow-up | prior |
| Character/aptitude/aging/body | character.service.ts | lifespan ledger and yin/yang | prior |
| Home/furniture/workstations | home.service.ts | 22-tier home ladder per prior | prior partial |
| Items/manuals/stores | inventory/item-repo/store services | full counts appendix files | prior partial |
| Farm/land/crops/staggering | farm.service.ts | fields and daily/batch consumers | NEW deeper read |
| Followers/pets/assignments/succession | followers.service.ts;followerResources.ts | service/interface families | prior partial |
| Battle/enemies/generated techniques | battle.service.ts | prior4.6k-line combat follow-up | prior |
| Contemplation/concept discovery | contemplation.service.ts | concept graph | prior |
| Hells/restricted challenges | hell.service.ts | 19 including hub per prior | prior full named follow-up |
| Pantheon/divine duels | pantheon.service.ts | service line count appendix | UNREAD full consumers |
| Impossible tasks/projects | impossibleTask.service.ts | carry/reset policies | prior |
| Achievement/memories | achievement.service.ts | 130 prior count;illustrated viewer | prior partial/new viewer |
| Log retention/narrative pacing | log.service.ts | 5 topics;9 intro entries | NEW deeper read |
| Locations/realms/portals | location.service.ts | full unlock graph unread | prior partial |
| Statistics/time/options | statistics.service.ts;UI components | file counts appendix | inventory/new partial |
| Desktop grid/help/text viewer | standard-layout/text-panel/tutorial | 144 app files total inventory | NEW static review |
| Mobile view | mobile-layout | component files appendix | inventory;deferred |
| Classic/old deployed builds | docs/classic,docs/old source lead | not copied/read here | UNREAD version variants |

Top three by payoff are detailed in [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md). Appendix rows marked inventory-only require semantic reading before adopting behavior.

## Complete pinned app file appendix

144 source/template files, excludes spec files and styles. Component and service locators include non-game helper surfaces. Coverage is family-level in the table above; no blanket semantic file completion.

| File | Lines | Classes |
|---|---|---|
| src/app/achievement-panel/achievement-panel.component.html | 32 | template/types |
| src/app/achievement-panel/achievement-panel.component.ts | 14 | AchievementPanelComponent |
| src/app/activity-options-modal/activity-options-modal.component.html | 32 | template/types |
| src/app/activity-options-modal/activity-options-modal.component.ts | 33 | ActivityOptionsModalComponent |
| src/app/activity-panel/activity-panel.component.html | 72 | template/types |
| src/app/activity-panel/activity-panel.component.ts | 148 | ActivityPanelComponent |
| src/app/activity-panel/activity-panel.service.ts | 87 | ActivityPanelService |
| src/app/app-routing.module.ts | 10 | AppRoutingModule |
| src/app/app.component.html | 5 | template/types |
| src/app/app.component.ts | 110 | AppComponent |
| src/app/app.service.ts | 8 | AppService |
| src/app/ascension-store-modal/ascension-store-modal.component.html | 102 | template/types |
| src/app/ascension-store-modal/ascension-store-modal.component.ts | 15 | AscensionStoreModalComponent |
| src/app/attributes-panel/attributes-panel.component.html | 44 | template/types |
| src/app/attributes-panel/attributes-panel.component.ts | 50 | AttributesPanelComponent |
| src/app/avatar-modal/avatar-modal.component.html | 233 | template/types |
| src/app/avatar-modal/avatar-modal.component.ts | 35 | AvatarModalComponent |
| src/app/battle-options-panel/battle-options-panel.component.html | 44 | template/types |
| src/app/battle-options-panel/battle-options-panel.component.ts | 37 | BattleOptionsPanelComponent |
| src/app/battle-panel/battle-panel.component.html | 140 | template/types |
| src/app/battle-panel/battle-panel.component.ts | 44 | BattlePanelComponent |
| src/app/changelog-panel/changelog-panel.component.html | 12 | template/types |
| src/app/changelog-panel/changelog-panel.component.ts | 8 | ChangelogPanelComponent |
| src/app/common-buttons.service.ts | 87 | CommonButtonsService |
| src/app/contemplation-panel/contemplation-panel.component.html | 16 | template/types |
| src/app/contemplation-panel/contemplation-panel.component.ts | 22 | ContemplationPanelComponent |
| src/app/crafting-options-modal/crafting-options-modal.component.html | 68 | template/types |
| src/app/crafting-options-modal/crafting-options-modal.component.ts | 68 | CraftingOptionsModalComponent |
| src/app/crafting-panel/crafting-panel.component.html | 147 | template/types |
| src/app/crafting-panel/crafting-panel.component.ts | 165 | CraftingPanelComponent |
| src/app/credits-modal/credits-modal.component.html | 50 | template/types |
| src/app/credits-modal/credits-modal.component.ts | 12 | CreditsModalComponent |
| src/app/divine-duels-panel/divine-duels-panel.component.html | 74 | template/types |
| src/app/divine-duels-panel/divine-duels-panel.component.ts | 16 | DivineDuelsPanelComponent |
| src/app/equipment-panel/equipment-panel.component.html | 130 | template/types |
| src/app/equipment-panel/equipment-panel.component.ts | 152 | EquipmentPanelComponent |
| src/app/farm-options-modal/farm-options-modal.component.html | 45 | template/types |
| src/app/farm-options-modal/farm-options-modal.component.ts | 42 | FarmOptionsModalComponent |
| src/app/farm-panel/farm-panel.component.html | 86 | template/types |
| src/app/farm-panel/farm-panel.component.ts | 84 | FarmPanelComponent |
| src/app/follower-management-panel/follower-management-panel.component.html | 127 | template/types |
| src/app/follower-management-panel/follower-management-panel.component.ts | 169 | FollowerManagementPanelComponent |
| src/app/followers-panel/followers-panel.component.html | 134 | template/types |
| src/app/followers-panel/followers-panel.component.ts | 157 | FollowersPanelComponent |
| src/app/furniture-store-modal/furniture-store-modal.component.html | 25 | template/types |
| src/app/furniture-store-modal/furniture-store-modal.component.ts | 29 | FurnitureStoreModalComponent |
| src/app/game-state/achievement.service.ts | 2317 | AchievementService |
| src/app/game-state/activity.service.ts | 6648 | ActivityService |
| src/app/game-state/activity.ts | 175 | template/types |
| src/app/game-state/battle.service.ts | 4611 | BattleService |
| src/app/game-state/character.service.ts | 1778 | CharacterService |
| src/app/game-state/contemplation.service.ts | 853 | ContemplationService |
| src/app/game-state/farm.service.ts | 500 | FarmService |
| src/app/game-state/followerResources.ts | 998 | template/types |
| src/app/game-state/followers.service.ts | 2462 | FollowersService |
| src/app/game-state/game-state.service.ts | 1800 | GameStateService |
| src/app/game-state/hell.service.ts | 1899 | HellService |
| src/app/game-state/home.service.ts | 2962 | HomeService |
| src/app/game-state/impossibleTask.service.ts | 328 | ImpossibleTaskService |
| src/app/game-state/inventory.service.ts | 3227 | InventoryService |
| src/app/game-state/item-repo.service.ts | 3940 | ItemRepoService |
| src/app/game-state/itemResources.ts | 721 | template/types |
| src/app/game-state/location.service.ts | 712 | LocationService |
| src/app/game-state/log.service.ts | 173 | LogService |
| src/app/game-state/main-loop.service.ts | 405 | MainLoopService |
| src/app/game-state/pantheon.service.ts | 636 | PantheonService |
| src/app/game-state/statistics.service.ts | 22 | StatisticsService |
| src/app/game-state/store.service.ts | 329 | StoreService |
| src/app/health-panel/health-panel.component.html | 126 | template/types |
| src/app/health-panel/health-panel.component.ts | 50 | HealthPanelComponent |
| src/app/health-panel/health.service.ts | 79 | HealthService |
| src/app/health-panel/yin-yang/yin-yang.component.html | 18 | template/types |
| src/app/health-panel/yin-yang/yin-yang.component.ts | 16 | YinYangComponent |
| src/app/hell-status-panel/hell-status-panel.component.html | 69 | template/types |
| src/app/hell-status-panel/hell-status-panel.component.ts | 21 | HellStatusPanelComponent |
| src/app/home-panel/home-panel.component.html | 130 | template/types |
| src/app/home-panel/home-panel.component.ts | 54 | HomePanelComponent |
| src/app/impossible-task-panel/impossible-task-panel.component.html | 81 | template/types |
| src/app/impossible-task-panel/impossible-task-panel.component.ts | 28 | ImpossibleTaskPanelComponent |
| src/app/inventory-options-modal/inventory-options-modal.component.html | 231 | template/types |
| src/app/inventory-options-modal/inventory-options-modal.component.ts | 144 | InventoryOptionsModalComponent |
| src/app/inventory-panel/inventory-panel.component.html | 208 | template/types |
| src/app/inventory-panel/inventory-panel.component.ts | 340 | InventoryPanelComponent |
| src/app/life-summary/life-summary.component.html | 37 | template/types |
| src/app/life-summary/life-summary.component.ts | 88 | LifeSummaryComponent |
| src/app/location-panel/location-panel.component.html | 25 | template/types |
| src/app/location-panel/location-panel.component.ts | 20 | LocationPanelComponent |
| src/app/log-filter-panel/log-filter-panel.component.html | 19 | template/types |
| src/app/log-filter-panel/log-filter-panel.component.ts | 19 | LogFilterPanelComponent |
| src/app/log-panel/log-panel.component.html | 22 | template/types |
| src/app/log-panel/log-panel.component.ts | 31 | LogPanelComponent |
| src/app/manual-store-modal/manual-store-modal.component.html | 28 | template/types |
| src/app/manual-store-modal/manual-store-modal.component.ts | 41 | ManualStoreModalComponent |
| src/app/memories-panel/memories-panel.component.html | 15 | template/types |
| src/app/memories-panel/memories-panel.component.ts | 13 | MemoriesPanelComponent |
| src/app/mobile-layout/mobile-activities/mobile-activities.component.html | 57 | template/types |
| src/app/mobile-layout/mobile-activities/mobile-activities.component.ts | 63 | MobileActivitiesComponent |
| src/app/mobile-layout/mobile-drawer/mobile-drawer.component.html | 51 | template/types |
| src/app/mobile-layout/mobile-drawer/mobile-drawer.component.ts | 19 | MobileDrawerComponent |
| src/app/mobile-layout/mobile-health/mobile-health.component.html | 131 | template/types |
| src/app/mobile-layout/mobile-health/mobile-health.component.ts | 43 | MobileHealthComponent |
| src/app/mobile-layout/mobile-layout.component.html | 24 | template/types |
| src/app/mobile-layout/mobile-layout.component.ts | 26 | MobileLayoutComponent |
| src/app/mobile-layout/mobile-time/mobile-time.component.html | 84 | template/types |
| src/app/mobile-layout/mobile-time/mobile-time.component.ts | 119 | MobileTimeComponent |
| src/app/mobile-layout/mobile-time-buttons/mobile-time-buttons.component.html | 51 | template/types |
| src/app/mobile-layout/mobile-time-buttons/mobile-time-buttons.component.ts | 30 | MobileTimeButtonsComponent |
| src/app/mobile-layout/mobile-widget-carousel/mobile-widget-carousel.component.html | 23 | template/types |
| src/app/mobile-layout/mobile-widget-carousel/mobile-widget-carousel.component.ts | 110 | MobileWidgetCarouselComponent |
| src/app/mobile-layout/mobile-widget-carousel/mobile-widget-carousel.service.ts | 28 | MobileWidgetCarouselService |
| src/app/offline-modal/offline-modal.component.html | 1 | template/types |
| src/app/offline-modal/offline-modal.component.ts | 13 | OfflineModalComponent |
| src/app/options-modal/options-modal.component.html | 99 | template/types |
| src/app/options-modal/options-modal.component.ts | 183 | OptionsModalComponent |
| src/app/pets-panel/pets-panel.component.html | 64 | template/types |
| src/app/pets-panel/pets-panel.component.ts | 45 | PetsPanelComponent |
| src/app/pipes.ts | 68 | FloorPipe, CamelToTitlePipe, BigNumberPipe |
| src/app/portal-panel/portal-panel.component.html | 31 | template/types |
| src/app/portal-panel/portal-panel.component.ts | 66 | PortalPanelComponent |
| src/app/schedule-panel/schedule-panel.component.html | 97 | template/types |
| src/app/schedule-panel/schedule-panel.component.ts | 213 | SchedulePanelComponent |
| src/app/standard-layout/standard-layout.component.html | 210 | template/types |
| src/app/standard-layout/standard-layout.component.ts | 135 | StandardLayoutComponent |
| src/app/statistics-panel/statistics-panel.component.html | 406 | template/types |
| src/app/statistics-panel/statistics-panel.component.ts | 51 | StatisticsPanelComponent |
| src/app/store-modal/store-modal.component.html | 58 | template/types |
| src/app/store-modal/store-modal.component.ts | 107 | StoreModalComponent |
| src/app/technique-options-modal/technique-options-modal.component.html | 39 | template/types |
| src/app/technique-options-modal/technique-options-modal.component.ts | 18 | TechniqueOptionsModalComponent |
| src/app/technique-panel/technique-panel.component.html | 138 | template/types |
| src/app/technique-panel/technique-panel.component.ts | 87 | TechniquePanelComponent |
| src/app/text-panel/text-panel.component.html | 20 | template/types |
| src/app/text-panel/text-panel.component.ts | 53 | TextPanelComponent |
| src/app/time-options-panel/time-options-panel.component.html | 122 | template/types |
| src/app/time-options-panel/time-options-panel.component.ts | 95 | TimeOptionsPanelComponent |
| src/app/time-panel/time-panel.component.html | 48 | template/types |
| src/app/time-panel/time-panel.component.ts | 51 | TimePanelComponent |
| src/app/tooltip/tooltip.component.html | 1 | template/types |
| src/app/tooltip/tooltip.component.ts | 17 | TooltipComponent |
| src/app/tooltip/tooltip.directive.ts | 100 | TooltipDirective |
| src/app/tutorial-panel/tutorial-panel.component.html | 98 | template/types |
| src/app/tutorial-panel/tutorial-panel.component.ts | 10 | TutorialPanelComponent |
| src/app/workstation-selection-modal/workstation-selection-modal.component.html | 18 | template/types |
| src/app/workstation-selection-modal/workstation-selection-modal.component.ts | 36 | WorkstationSelectionModalComponent |

Version sub-sources: [SUBSOURCES.md](SUBSOURCES.md). Current, classic, old, v1 and experimental entry points read; experimental2 has no index. Mechanics remain unread.
