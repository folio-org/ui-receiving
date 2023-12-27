# Change history for ui-receiving

## 4.1.0 (IN PROGRESS)
* Include Accession number field in receive all view. Refs UIREC-285.
* Display and edit claiming active and interval fields in receiving title. Refs UIREC-288.
* Optimize pieces query to improve performance. Refs UIREC-298.
* Display claim actions for Piece. Refs UIREC-291.
* Set claiming workflow statuses for single Piece. Refs UIREC-292.
* Add unreceivable accordion to receiving title view. Refs UIREC-302.
* Add validation for the `claimingInterval` field. Refs UIREC-308.

## [4.0.0](https://github.com/folio-org/ui-receiving/tree/v4.0.0) (2023-10-12)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v3.0.0...v4.0.0)

* Unpin `@rehooks/local-storage` now that it's no longer broken. Refs UIREC-259.
* Also support `circulation` `14.0`. Refs UIREC-270.
* Receiving an item with an open request, the warning dialogue shows "undefined" instead of title. Refs UIREC-278.
* Upgrade `Node.js` to `18` version in GitHub Actions. Refs UIREC-281.
* *BREAKING* Upgrade React to v18. Refs UIREC-280.
* *BREAKING* bump `react-intl` to `v6.4.4`. Refs UIREC-286.
* Bump optional plugins to their `@folio/stripes` `v9` compatible versions. Refs UIREC-290.
* Check if a holding exists during the abandonment check. Refs UIREC-294.

## [3.0.0](https://github.com/folio-org/ui-receiving/tree/v3.0.0) (2023-02-22)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.3.1...v3.0.0)

* Results List | Hyperlink one column to improve accessibility. Refs UIREC-244.
* Avoid using `setTimeout()` in handlers. Refs UIREC-251.
* Align the module with API breaking change. Refs UIREC-256.
* Map missed error codes with new translations. Refs UIREC-260.
* *BREAKING*: Update `@folio/stripes` to `8.0.0`. Refs UIREC-257.
* Extra holding appears when creating new holding for already existing location during "Quick receive". Refs UIREC-261.

## [2.3.1](https://github.com/folio-org/ui-receiving/tree/v2.3.1) (2022-11-30)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.3.0...v2.3.1)

* Item statuses other than `Order closed` or `On order` are set to `In process` upon receiving. Refs UIREC-250.
* Loose plugin dependencies permit incompatible versions. Refs UIREC-252.
* "No results found" shown after return to search page. Refs UIREC-253.

## [2.3.0](https://github.com/folio-org/ui-receiving/tree/v2.3.0) (2022-10-27)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.2.0...v2.3.0)

* Support holdings-storage 6.0 in okapiInterfaces. Refs UIREC-242.
* Support inventory 12.0 in okapiInterfaces. Refs UIREC-243.

## [2.2.0](https://github.com/folio-org/ui-receiving/tree/v2.2.0) (2022-07-07)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.1.0...v2.2.0)

* Filter Receiving titles by 'Rush'. Refs UIREC-205.
* Add Caption detail to the Unreceive screen. Refs UIREC-226.
* Select filter should announce the number of Results in the Results List pane header. Refs UIREC-227.
* Remove react-hot-loader. Refs UIREC-230.
* Insufficient padding when displaying location key value and receiving note in full screen view. Refs UIREC-231.
* Replace `babel-eslint` with `@babel/eslint-parser`. Refs UIREC-232.
* Add translations for permissions. Refs UIREC-75.
* ui-receiving: module warnings analysis. Refs UIREC-237.
* Add "Export results (CSV)" action to receiving app. Refs UIREC-233.
* Allow user to select data points for Export results to CSV. Refs UIREC-234.
* Export pieces functionality - FE approach. Refs UIREC-235.

## [2.1.0](https://github.com/folio-org/ui-receiving/tree/v2.1.0) (2022-03-03)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.0.3...v2.1.0)

* Allow user to select instance for Title AND edit title from POL view. Refs UIREC-189.
* Allow user to save and create another piece. Refs UIREC-188.
* Tech debt: reducing code smells, usage of consts and resources from stripes-acq. Refs UIREC-192.
* Validate user has made a change to the piece form before activating "Save" or "Quick receive" buttons. Refs UIREC-190.
* Display comment in receiving in column rather than on hover. Refs UIREC-193.
* Allow user to choose what columns display for expected and received pieces. Refs UIREC-196.
* Add a return to Receiving default search to app context menu dropdown. Refs UIREC-201.
* Also support `circulation` `13.0`. Refs UIREC-195.
* Hide "Suppress from discovery" toggle from Piece form. Refs UIREC-208.
* Piece received date is not timezone formatted. Refs UIREC-211.
* Pagination for expected and received pieces. Refs UIREC-213.
* refactor psets away from backend '.all' permissions. Refs UIREC-177.
* Filters for expected and received pieces. Refs UIREC-191.
* Item status changes unclear from receiving screen. Refs UIREC-218.
* Item status unclear in receiving screen. Refs UIREC-214.
* Some fields of the piece are not populated when receiving/unreceiving. Refs UIREC-220.
* Accessibility analysis. Refs UIREC-221.
* Replace deprecated permission search.instances.facets.collection.get. Refs UIREC-224.

## [2.0.3](https://github.com/folio-org/ui-receiving/tree/v2.0.3) (2021-12-08)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.0.2...v2.0.3)

* Receiving app is reaching the display limit of 1000 pieces - User can't see newly created pieces. Refs UIREC-197.
* Also support `circulation` `12.0`. Refs UIREC-194.

## [2.0.2](https://github.com/folio-org/ui-receiving/tree/v2.0.2) (2021-11-04)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.0.1...v2.0.2)

* Receiving: Update manually add pieces for receiving field. Refs UIREC-186.

## [2.0.1](https://github.com/folio-org/ui-receiving/tree/v2.0.1) (2021-11-02)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v2.0.0...v2.0.1)

* Display "Invalid reference" when Holdings ID is not valid. Refs UIREC-182.
* Confirm user would like to delete holdings record when changing Holdings link of Piece. Refs UIREC-181.
* Permission- "Receiving: view and edit" missing instance plugin perms. Refs UIREC-184.

## [2.0.0](https://github.com/folio-org/ui-receiving/tree/v2.0.0) (2021-10-08)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.4.2...v2.0.0)

* Also support `holdings-storage` `5.0` and `inventory` `11.0`. Refs UIREC-139.
* The Delete button is displayed in the Add piece pop up (new pice). Refs UIREC-146.
* Ability to sort expected pieces by other table headers. Refs UIREC-147.
* Connect items created for pieces to holdings. Refs UIREC-152.
* Update create, edit and receive piece forms with additional fields. Refs UIREC-135.
* Use mod-orders for piece queries. Refs UIREC-55.
* Make keyboard shortcuts for receiving screens. Refs UIREC-157.
* Allow user to adjust order quantity and location/hodlings connection from receiving ui. Refs UIREC-132.
* Save piece toast message message. Refs UIREC-159.
* Increment stripes to v7. Refs UIREC-154.
* Display order line locations on piece form. Refs UIREC-163.
* Display Caption, Copy number in piece form. Refs UIREC-160.
* Update Received/Expected piece table columns. Refs UIREC-158.
* Receiving - Implement MCL Next/Previous pagination. Refs UIREC-164.
* Piece location/holding field adjustments. Refs UIREC-162.
* Display Holding OR Location name in location column in search results. Refs UIREC-172.
* Filter label contains extra 's'. Refs UIREC-173.
* Disable add and remove piece when order is pending. Refs UIREC-174.
* Do not show 'Display on holdings' when create inventory does not include 'Holdings'. Refs UIREC-178.
* Confirm if user would like to delete holdings record when deleting piece. Refs UIREC-175.

## [1.4.2](https://github.com/folio-org/ui-receiving/tree/v1.4.2) (2021-08-05)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.4.1...v1.4.2)

* Location filter not returning results when expected. Refs UIREC-149.

## [1.4.1](https://github.com/folio-org/ui-receiving/tree/v1.4.1) (2021-07-27)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.4.0...v1.4.1)

* permission sets should avoid .all permissions. Refs UIREC-141.

## [1.4.0](https://github.com/folio-org/ui-receiving/tree/v1.4.0) (2021-06-17)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.3.4...v1.4.0)

* Also support `circulation` `11.0`. Refs UIPCIR-21.
* Receiving: Add filters for Expected receipt date and Received date. Refs UIREC-120.
* Implement Keyboard shortcuts modal. Refs UIREC-134.
* Compile Translation Files into AST Format. Refs UIREC-125.
* Display requester from POL when there is one. Refs UIREC-114.
* "Expected receipt date" in Title POL accordion showing wrong date. Refs UIREC-137.
* Resizable Panes - Persistence | Use PersistedPaneset smart component. Refs UIREC-127.
* Receiving app | Apply baseline keyboard shortcuts. Refs UIREC-117.
* Allow user to select holding or location at point of receipt. Refs UIREC-133.

## [1.3.4](https://github.com/folio-org/ui-receiving/tree/v1.3.4) (2021-06-17)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.3.3...v1.3.4)

* CANNOT receive pieces against package POL. Refs UIREC-143.
* Receiving search: 'No records found' when location is removed. Refs UIREC-142.

## [1.3.3](https://github.com/folio-org/ui-receiving/tree/v1.3.3) (2021-04-21)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.3.2...v1.3.3)

* Permissions for select instance plugin. Refs UIREC-130.
* Add missed permissions. Refs UIREC-129.

## [1.3.2](https://github.com/folio-org/ui-receiving/tree/v1.3.2) (2021-04-13)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.3.1...v1.3.2)

* Add option to search by Vendor reference number. Refs UIREC-119.

## [1.3.1](https://github.com/folio-org/ui-receiving/tree/v1.3.1) (2021-04-06)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.3.0...v1.3.1)

* Calendar widget cutoff by modal when editing pieces. Refs UIREC-118.

## [1.3.0](https://github.com/folio-org/ui-receiving/tree/v1.3.0) (2021-03-15)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.2.1...v1.3.0)

* Upgrade to stripes v6.
* Fix receiving transaction results in unexpected error message. Refs UIREC-112.
* No longer have delete option for Piece. Refs UIREC-113.
* Add personal data disclosure form. Refs UIREC-110.

## [1.2.1](https://github.com/folio-org/ui-receiving/tree/v1.2.1) (2020-11-10)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.2.0...v1.2.1)

* Fix Piece displays as connected to an item when connected item record has been deleted. Refs UIREC-102
* Orders and receiving - want to see that an order is closed in search result list. Refs UIOR-620
* Display warning modal when user trying to receive against a closed Order. Refs UIREC-100.

## [1.2.0](https://github.com/folio-org/ui-receiving/tree/v1.2.0) (2020-10-09)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.1.0...v1.2.0)

* Update view pane to display null as hyphen - Receving. Refs UIREC-98
* Update subheading of the Receiving landing page Search results pane. Refs UIREC-96

### Stories
* [UIREC-95](https://issues.folio.org/browse/UIREC-95) Display 'Vendor', 'Material supplier', 'Access provider' and 'Order type' in title view pane
* [UISACQCOMP-3](https://issues.folio.org/browse/UISACQCOMP-3) Handle import of stripes-acq-components to modules and platform

### Bugs
* [UIREC-73](https://issues.folio.org/browse/UIREC-73) Accessibility Error: Form elements must have labels

## [1.1.0](https://github.com/folio-org/ui-receiving/tree/v1.1.0) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.0.4...v1.1.0)

### Stories
* [UIREC-90](https://issues.folio.org/browse/UIREC-90) Update select location workflow for Piece creation/edit
* [UIREC-91](https://issues.folio.org/browse/UIREC-91) Update Create Item workflow for Piece creation/edit
* [UIREC-83](https://issues.folio.org/browse/UIREC-83) Suppot back-end changes in related story
* [UIREC-80](https://issues.folio.org/browse/UIREC-80) Receiving app: Update to Stripes v4
* [UIREC-47](https://issues.folio.org/browse/UIREC-47) Create/lookup instance from receiving Title when not using instance lookup
* [UIREC-42](https://issues.folio.org/browse/UIREC-42) Filter Titles by piece status and Acq unit
* [UIREC-70](https://issues.folio.org/browse/UIREC-70) Display receiving note in multi-piece receiving view
* [UINV-138](https://issues.folio.org/browse/UINV-138) Align actions icons in table to right hand side of view pane(s)

### Bug fixes
* [UIREC-49](https://issues.folio.org/browse/UIREC-49) Save & close button should be disabled until all required fields have values entered
* [UIREC-46](https://issues.folio.org/browse/UIREC-46) Action buttons are not aligning to the right and are displaying states incorrectly
* [UIREC-94](https://issues.folio.org/browse/UIREC-94) Ability to edit unreceived pieces
* [UIREC-92](https://issues.folio.org/browse/UIREC-92) Add Piece modal keeps values from previously edited piece
* [UIORGS-151](https://issues.folio.org/browse/UIORGS-151) Organizations is not using the same Expand/Collapse as implemented in Q4 2019

## [1.0.4](https://github.com/folio-org/ui-receiving/tree/v1.0.4) (2020-05-27)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.0.3...v1.0.4)

### Bug fixes
* [UIREC-93](https://issues.folio.org/browse/UIREC-93) Only see 10 pieces per POL in Receiving

## [1.0.3](https://github.com/folio-org/ui-receiving/tree/v1.0.3) (2020-04-25)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.0.2...v1.0.3)

### Bug fixes
* [UIREC-78](https://issues.folio.org/browse/UIREC-78) Fill PO Line id on create Item request from Add Item modal

## [1.0.2](https://github.com/folio-org/ui-receiving/tree/v1.0.2) (2020-04-06)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.0.1...v1.0.2)

### Bug fixes
* [UIOR-537](https://issues.folio.org/browse/UIOR-537) add missed Location lookup permissions

## [1.0.1](https://github.com/folio-org/ui-receiving/tree/v1.0.1) (2020-03-27)
[Full Changelog](https://github.com/folio-org/ui-receiving/compare/v1.0.0...v1.0.1)

### Bug fixes
* [UIREC-66](https://issues.folio.org/browse/UIREC-66) POL details displaying under Title information accordion
* [UIREC-67](https://issues.folio.org/browse/UIREC-67) Edit piece modal: Incorrect button label
* [UIREC-65](https://issues.folio.org/browse/UIREC-65) Must acknowledge receiving note modal not popping up when clicking "receive"
* [UIREC-62](https://issues.folio.org/browse/UIREC-62) Hotlink POL number in receiving to POL in orders
* [UIREC-59](https://issues.folio.org/browse/UIREC-59) Improve Select location dropdown to use only select Location plugin
* [UIREC-61](https://issues.folio.org/browse/UIREC-61) Caption not displayed when receiving or undeceiving pieces

## [1.0.0](https://github.com/folio-org/ui-receiving/tree/v1.0.0) (2020-03-13)

### Stories
* [UIREC-56](https://issues.folio.org/browse/UIREC-56) Edit piece from clicking table row
* [UIREC-54](https://issues.folio.org/browse/UIREC-54) Update "Unreceive" piece to full screen
* [UIREC-53](https://issues.folio.org/browse/UIREC-53) Update "receive" piece Modal to full screen
* [UIREC-52](https://issues.folio.org/browse/UIREC-52) Update title record Expected and Received accordion columns
* [UIREC-48](https://issues.folio.org/browse/UIREC-48) Select any location for piece when receiving
* [UIREC-45](https://issues.folio.org/browse/UIREC-45) Update receiving icon to new version
* [UIREC-35](https://issues.folio.org/browse/UIREC-35) Edit or receive piece from title view
* [UIREC-36](https://issues.folio.org/browse/UIREC-36) Unreceive piece for a given Title
* [UIREC-29](https://issues.folio.org/browse/UIREC-29) Receiving: filter titles
* [UIREC-33](https://issues.folio.org/browse/UIREC-33) Update app icon
* [UIREC-32](https://issues.folio.org/browse/UIREC-32) Add piece for a title
* [UIREC-39](https://issues.folio.org/browse/UIREC-39) Receiving: search for titles - Column headers
* [UIREC-31](https://issues.folio.org/browse/UIREC-31) Receiving: search for titles
* [UIREC-34](https://issues.folio.org/browse/UIREC-34) Add success message for create title
* [UIREC-28](https://issues.folio.org/browse/UIREC-28) Add Title for receiving/check-in
* [UIREC-27](https://issues.folio.org/browse/UIREC-27) View title in receiving area
* [UIREC-26](https://issues.folio.org/browse/UIREC-26) Create three pane layout for receiving
* New app created with stripes-cli

### Bug fixes
* [UIREC-43](https://issues.folio.org/browse/UIREC-43) Add piece button showing for Titles that are not "Manually add pieces for receiving"
