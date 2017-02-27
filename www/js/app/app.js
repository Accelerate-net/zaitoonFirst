angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

angular.module('zaitoonFirst', [
  'ngCordova',

  'ionic',
  'zaitoonFirst.views',
  'zaitoonFirst.common.controllers',
  'zaitoonFirst.common.directives',

  'zaitoonFirst.account.controllers',
  'zaitoonFirst.account.directives',
  'zaitoonFirst.account.services',

  'zaitoonFirst.auth.controllers',
  'zaitoonFirst.auth.directives',
  'zaitoonFirst.auth.services',

  'zaitoonFirst.checkout.controllers',
  'zaitoonFirst.checkout.directives',
  'zaitoonFirst.checkout.services',

  'zaitoonFirst.content.controllers',
  'zaitoonFirst.content.directives',
  'zaitoonFirst.content.services',

  'zaitoonFirst.feed.controllers',
  'zaitoonFirst.feed.directives',
  'zaitoonFirst.feed.filters',
  'zaitoonFirst.feed.services',

  'zaitoonFirst.filters.controllers',
  'zaitoonFirst.filters.directives',
  'zaitoonFirst.filters.services',

  'zaitoonFirst.getting-started.controllers',
  'zaitoonFirst.getting-started.directives',
  'zaitoonFirst.getting-started.services',

  'zaitoonFirst.search.controllers',
  'zaitoonFirst.search.directives',
  'zaitoonFirst.search.filters',
  'zaitoonFirst.search.services',

  'zaitoonFirst.shopping-cart.controllers',
  'zaitoonFirst.shopping-cart.directives',
  'zaitoonFirst.shopping-cart.services',

  'zaitoonFirst.walkthrough.controllers',
  'zaitoonFirst.walkthrough.directives',
  'zaitoonFirst.walkthrough.services',

  'underscore',
  'angularMoment',
  'ngMap',
  'ngRangeSlider'
])

.run(function($ionicPlatform, amMoment, $rootScope) {


  $rootScope.previousView = [];

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    var last_state = _.last($rootScope.previousView);

    if(last_state && (last_state.fromState === toState.name)){
      $rootScope.previousView.pop();
    }else{
      $rootScope.previousView.push({ "fromState": fromState.name, "fromParams": fromParams });
    }
  });

  $ionicPlatform.ready(function() {

    //Push Notifications
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal
    .startInit("5898aab6-5781-46b0-9eb2-85d6637699ca")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();



    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    amMoment.changeLocale('en-gb');
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.form.checkbox('circle');

  if(!ionic.Platform.isWebView())
  {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('intro', {
    url: '/intro',
    abstract: true,
    templateUrl: 'views/common/intro.html'
  })

      .state('intro.walkthrough-welcome', {
        url: '/walkthrough-welcome',
        views: {
          'intro-view@intro': {
            templateUrl: 'views/walkthrough/welcome.html',
            controller: 'welcomeCtrl'
          }
        }
      })

      .state('intro.walkthrough-learn', {
        url: '/walkthrough-learn',
        views: {
          'intro-view@intro': {
            templateUrl: 'views/walkthrough/learn.html',
            controller: 'GettingStartedCtrl'
          }
        }
      })

      .state('intro.auth-login', {
        url: '/auth-login',
        views: {
          'intro-view@intro': {
            templateUrl: 'views/auth/login.html',
            controller: 'LoginCtrl'
          }
        }
      })

      .state('intro.auth-signup', {
        url: '/auth-signup',
        views: {
          'intro-view@intro': {
            templateUrl: 'views/auth/signup.html',
            controller: 'SignupCtrl'
          }
        }
      })

      .state('intro.auth-forgot-password', {
        url: '/forgot-password',
        views: {
          'intro-view@intro': {
            templateUrl: 'views/auth/forgot-password.html',
            controller: 'ForgotPasswordCtrl'
          }
        }
      })

  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'views/common/main.html'
  })

      .state('main.app', {
        url: '/app',
        abstract: true,
        views: {
          'main-view@main': {
            templateUrl: 'views/common/app.html',
            controller: 'AppCtrl'
          }
        },
        resolve: {
          logged_user: function(AuthService){
            return AuthService.getLoggedUser();
          }
        }
      })




          .state('main.app.filters', {
            url: '/filters',
            views: {
              'main-view@main': {
                templateUrl: 'views/filters/filters.html',
                controller: 'FiltersCtrl'
              }
            }
          })



          .state('main.app.feed', {
            url: '/feed',
            views: {
              'app-feed@main.app': {
                templateUrl: 'views/feed/feed.html',
                controller: 'FeedCtrl'
              }
            }
          })


              .state('main.app.feed.arabian', {
                url: '/arabian',
                views: {
                  'category-feed@main.app.feed': {
                    templateUrl: 'views/feed/menu.html',
                    controller: 'FoodArabianCtrl'
                  }
                }
              })

              .state('main.app.feed.chinese', {
                url: '/chinese',
                views: {
                  'category-feed@main.app.feed': {
                    templateUrl: 'views/feed/menu.html',
                    controller: 'FoodChineseCtrl'
                  }
                }
              })

              .state('main.app.feed.indian', {
                url: '/indian',
                views: {
                  'category-feed@main.app.feed': {
                    templateUrl: 'views/feed/menu.html',
                    controller: 'FoodIndianCtrl'
                  }
                }
              })

              .state('main.app.feed.dessert', {
                url: '/dessert',
                views: {
                  'category-feed@main.app.feed': {
                    templateUrl: 'views/feed/menu.html',
                    controller: 'FoodDessertCtrl'
                  }
                }
              })


                  .state('main.app.outlets', {
                    url: '/content/:outletCode',
                    views: {
                      'main-view@main': {
                        templateUrl: 'views/content/outlet.html',
                        controller: 'outletCtrl'
                      }
                    },
                    resolve: {
                      outlet: function(OutletService, $stateParams){
                        return OutletService.getOutlet($stateParams.outletCode);
                      }
                    }
                  })











          .state('main.app.deals', {
            url: '/deals',
            views: {
              'app-deals@main.app': {
                templateUrl: 'views/deals/deals.html',
                controller: 'DealsCtrl'
              }
            }
          })




          .state('main.app.account', {
            url: '/account',
            views: {
              'app-account@main.app': {
                templateUrl: 'views/account/account.html'
              }
            }
          })

              .state('main.app.account.profile', {
                url: '/profile',
                views: {
                  'my-profile@main.app.account': {
                    templateUrl: 'views/account/profile.html',
                    controller: 'ProfileCtrl'
                  }
                },
                resolve: {
                  user: function(ProfileService){
                    return ProfileService.getUserData();
                  }
                }
              })

              .state('main.app.account.orders', {
                url: '/orders',
                views: {
                  'my-orders@main.app.account': {
                    templateUrl: 'views/account/orders.html',
                    controller: 'OrdersCtrl'
                  }
                }
              })

          .state('main.app.shopping-cart', {
            url: '/shopping-cart',
            views: {
              'main-view@main': {
                templateUrl: 'views/shopping-cart/cart.html',
                controller: 'ShoppingCartCtrl'
              }
            },
            resolve: {
              products: function(ShoppingCartService){
                return ShoppingCartService.getProducts();
              }
            }
          })

          .state('main.app.checkout', {
            url: '/checkout',
            views: {
              'main-view@main': {
                templateUrl: 'views/checkout/checkout.html',
                controller: 'CheckoutCtrl'
              }
            },
            resolve: {
              products: function(ShoppingCartService){
                return ShoppingCartService.getProducts();
              }
            }
          })

              .state('main.app.checkout.address', {
                url: '/address',
                views: {
                  'main-view@main': {
                    templateUrl: 'views/checkout/address.html',
                    controller: 'CheckoutAddressCtrl'
                  }
                },
                resolve: {
                  user_shipping_addresses: function(CheckoutService){
                    return CheckoutService.getUserShippingAddresses();
                  }
                }
              })

              .state('main.app.checkout.track', {
                url: '/track',
                views: {
                  'main-view@main': {
                    templateUrl: 'views/checkout/track.html',
                    controller: 'trackCtrl'
                  }
                }
              })

              .state('main.app.checkout.payment', {
                url: '/payment',
                views: {
                  'main-view@main': {
                    templateUrl: 'views/checkout/payment.html',
                    controller: 'paymentCtrl'
                  }
                }
              })

              .state('main.app.checkout.feedback', {
                url: '/feedback',
                views: {
                  'main-view@main': {
                    templateUrl: 'views/checkout/feedback.html',
                    controller: 'feedbackCtrl'
                  }
                }
              })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/intro/walkthrough-welcome');
  // $urlRouterProvider.otherwise('/main/app/feed/fashion');
});
