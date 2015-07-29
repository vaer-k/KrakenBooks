angular.module('omnibooks.profile', ['ui.bootstrap','ngFileUpload','xeditable'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
.controller('ProfileController', ['$scope', '$stateParams', '$modal', '$state', 'auth', 'fireBase', 'bookinfoAPI', 'Upload','$http',
  function($scope, $stateParams, $modal, $state, auth, fireBase, bookinfoAPI, Upload, $http) {
    var currentOrg = auth.getOrg();
    var currentUser = auth.getUser();
      $scope.upload = function (files) {
        if(files){
          console.log('up load file!!!')
        console.log(files);
        var file = files[0];
      }
    };

    $scope.enterBook = function(url, isbn, price, files) {
      $scope.upload(files);
      url = url||'http://books.sorodesign.com/wp-content/uploads/2010/01/book-cover-full-small.jpg'
      if (isbn && price) {
        $scope.error = false;
        if (isbn.charAt(3) === '-') {
          isbn = isbn.slice(0, 3) + isbn.slice(4)
          console.log(isbn)
        }
        var displayDetail = function(res) {
           // $scope.prices = res.data.data;
          title = res[0].title_long;
          author = res[0].author_data[0].name;

        fireBase.enterBook(currentOrg, currentUser.$id, title, url, author, isbn, price);
        console.log('successfully entered');
           
        };

        if (price.charAt(0) === '$') {
          price = price.slice(1);
          console.log(price)
        }

        bookinfoAPI.getInfo(isbn, displayDetail);

      } else {
        $scope.error = "*You must fill out all required fields";
      }
  };


    $scope.enterItem = function(itemImgUrl, itemName, itemDescription, itemPrice) {
      if (itemName && itemImgUrl && itemDescription) {
        $scope.error = false;
        if (itemPrice.charAt(0) === '$') {
          itemPrice = itemPrice.slice(1);
        }

        fireBase.enterBook(currentOrg, currentUser.$id, itemName, itemImgUrl, itemDescription, '0812550706', itemPrice);
        console.log('successfully entered');
      } else{
        $scope.error = "*You must fill out all required fields";
      }
    };

    $scope.deleteBook = function(book) {
      console.log(book);
      fireBase.deleteBook($scope.org, $scope.username, book.$id);
    };
    $scope.username = auth.getUser().$id;
    $scope.org = auth.getOrg();
    $scope.noBooks = false;
    $scope.books = fireBase.getUserBookshelf($scope.org, $scope.username);


    if($scope.books.length === 0) {
      noBooks = true;
    }


  // modal methods
  $scope.animationsEnabled = true;
  $scope.modalShown = false;
  $scope.toggleUploadModal = function() {
    if(!$scope.error) {
      $scope.uploadModalShown = !$scope.uploadModalShown;
    }
  };
  $scope.toggleEditModal = function(book) {
    if(!$scope.error) {
      $scope.editModalShown = !$scope.editModalShown;
      $scope.bookEdit = book;
    }
  };
  $scope.toggleItemModal = function() {
    if(!$scope.error) {
      $scope.itemModalShown = !$scope.itemModalShown;
    }
  };

  $scope.updateBook = function() {
    var update = {
      title: $scope.bookEdit.title,
      author: $scope.bookEdit.author,
      img: $scope.bookEdit.img,
      isbn: $scope.bookEdit.isbn,
      askingPrice: $scope.bookEdit.askingPrice
    }
    fireBase.updateBook($scope.org, $scope.username, $scope.bookEdit.$id, update);
  }
}])
.directive('modal', function() {
  return {
    templateUrl: "../html/bookUpload.html",
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    }
  };
})
.factory('bookinfoAPI', function($http) {
    var key = 'UTUJEB5A';
    var getInfo = function(isbn, callback) {
      return $http({
          method: 'GET',
          url: '/bookInfo',
          params: {
            'book_isbn': isbn
          }
        })
        .then(function(res) {
          callback(res.data.data);
        });
    };
    return {
      getInfo: getInfo
    };
});
