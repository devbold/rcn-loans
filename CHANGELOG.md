# Changelog

## **Unreleased**

### Features:
- Added pay loan option
- Lend using ETH if user has no RCN balance

### Misc:
- Setup unit tests
- Setup e2e tests

### Fix:
- Fix bug when loading metamask privacy on account detail
- Fix try to lend an invalid mortgage request
- Fix bug when the request is expired, the estimated return of a loan shows an incorrect amount

## **0.0.10-D** Avocados - 2018/11/14

### Features:
- Added support for Metamask privacy mode

### Misc:
- Display correct status on expired loans
- Update Decentraland mortgages contracts
- Hide the transfer button on paid loans 

## **0.0.10** Avocados - 2018/10/30

### Changes:
- Add transfer loan ownership button
- New Decentraland cosigner detail
- Added loading spinner to transaction history

### Misc:
- Migrated to Bootstrap V4
- Refactor requests component

### Fixes:
- Fix display version footer
- Fix transaction history display
- Fix display claim button, cosigner
- Fix validate Oracle, address(0)
- Fix font size, interest rate
- Fix transaction history icons

## **0.0.9** Avocados - 2018/09/18

### Features:
- Added snackbar notification for ethereum transactions
- Set-up Decentraland contracts

### Fixes:
- Fix back button in loan detail
- Fix 404 page not displaying
- Fix build number tooltip

## **0.0.8** Avocados - 2018/08/24

### Features:
- Display loan history
- New navigation loan detail
- Added Sentry integration
- Added Google Analytics integration
- Filter allowed countries
- Now using Angular 6
- Display error messages
- Show feedback performing heavy operations

### Fixes:
- Fix Civic dialog
- Responsive mobile fixes
- Fix production build
- Fix Meta OG Tracking Facebook / Twitter
- Fix poor visibility of the approve contract checkbox
- Fix limit size of the duration label

## **0.0.7** Avocados - 2018/07/10

- Not enough funds dialog
- 404 page
- Show Oracle in loan detail
- Meta OG for sharing
- New Decentraland API Scheme
- Replaced Decentraland API URL
- Added new Mortgage Creator
- Responsive improvements
- Bug fixes

## **0.0.6** Avocados - 2018/06/25

- New sidebar and navigation bar
- Improvements in mobile navigation
- Ability to claim liabilities from cosigners
- Activity tab with all the active loans
- Refactor in cosigner service, created cosigner 'Providers'
- Upgraded API for Decentraland
- Replaced Decentraland canvas by its new map API
