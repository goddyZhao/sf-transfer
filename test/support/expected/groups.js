module.exports = [
  {
    pattern: 'homepageTileFramework',// pattern for homepageTileFramework
    responder: {
      dir: 'fill the dir',
      src: [
        '/ui/homepage/js/common/HMPUtil.js',
        '/ui/homepage/js/tileFramework/hmpAnimUtil.js',
        '/ui/homepage/js/tileFramework/hmpGenericTileDAO.js',
        '/ui/homepage/js/dropMenu/hmpAbstractMenuModel.js',
        '/ui/homepage/js/dropMenu/hmpArrayMenuModel.js',
        '/ui/homepage/js/dropMenu/hmpDropMenu.js',
        '/ui/homepage/js/tileFramework/hmpTile.js',
        '/ui/homepage/js/tileFramework/hmpLoadingTile.js',
        '/ui/homepage/js/tileFramework/hmpTileLayout.js',
        '/ui/homepage/js/tileFramework/hmpTileModel.js',
        '/ui/homepage/js/tileFramework/hmpAbstractTileDAO.js',
        '/ui/homepage/js/tileFramework/hmpErrorTile.js',
        '/ui/homepage/js/tileFramework/hmpAbstractTileFactory.js',
        '/ui/homepage/js/tileFramework/hmpMultiControllerTileDAO.js',
        '/ui/homepage/js/common/hmpLoadingIndicator.js',
        '/ui/homepage/js/common/hmpAutoCompleteFindMultipleUsers.js',
        '/ui/homepage/js/common/hmpProfileNavigationMenuModel.js',
        '/ui/homepage/js/common/hmpQuickCardMenuModel.js',
        '/ui/homepage/js/common/hmpClock.js',
        '/ui/homepage/js/common/hmpFilterInput.js',
        '/ui/homepage/js/tilePlugins/hmpTileUtil.js',
        '/ui/homepage/js/home/hmpHomePageTileFactory.js',
        '/ui/homepage/js/home/hmpHomePageTileDAO.js'
      ]
    }
  },
  {
    pattern: 'homepageTilePlugins',// pattern for homepageTilePlugins
    responder: {
      dir: 'fill the dir',
      src: [
        '/ui/homepage/js/todoCompat/hmpTodoCompatConversion.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatDAO.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatUtil.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatAction.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatItem.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatGroup.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatList.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatMini.js',
        '/ui/homepage/js/todoCompat/hmpTodoCompatTile.js',
        '/ui/homepage/js/tilePlugins/hmpQuickLinksTile.js',
        '/ui/homepage/js/tilePlugins/hmpAdminFavoritesTile.js',
        '/ui/homepage/js/tilePlugins/hmpMyInfoTile.js',
        '/ui/homepage/js/tilePlugins/hmpWelcomeTile.js',
        '/ui/homepage/js/tilePlugins/hmpCyclePhotosTile.js',
        '/ui/homepage/js/tilePlugins/hmpAdminAlertsTile.js',
        '/ui/homepage/js/myTeam/hmpMyTeamUtil.js',
        '/ui/homepage/js/myTeam/hmpTeamList.js',
        '/ui/homepage/js/myTeam/hmpJobReqList.js',
        '/ui/homepage/js/myTeam/hmpMyTeamTileModel.js',
        '/ui/homepage/js/myTeam/hmpTeamSlider.js',
        '/ui/homepage/js/myTeam/hmpMyTeamColumnView.js',
        '/ui/homepage/js/myTeam/hmpBadge.js',
        '/ui/homepage/js/myTeam/hmpNote.js',
        '/ui/homepage/js/myTeam/hmpNudge.js',
        '/ui/homepage/js/myTeam/hmpMyTeamActionMenuModel.js',
        '/ui/homepage/js/myTeam/hmpMyTeamTile.js',
        '/ui/homepage/js/tilePlugins/hmpTileSample.js',
        '/ui/homepage/js/tilePlugins/hmpTileBrowserTile.js'
      ]
    }
  },
  {
    pattern: 'homepageSetupWizard',// pattern for homepageSetupWizard
    responder: {
      dir: 'fill the dir',
      src: [
        '/ui/homepage/js/setupWizard/hmpSetupWizard.js',
        '/ui/homepage/js/setupWizard/hmpSetupWizardDAO.js'
      ]
    }
  }/*{{more}}*/
];