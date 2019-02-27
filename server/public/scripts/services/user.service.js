myApp.service("UserService", [
  "$http",
  "$location",
  "$mdDialog",
  function($http, $location, $mdDialog) {
    console.log("UserService Loaded");
    var self = this;

    self.userObject = {};

    (self.getuser = function() {
      // console.log('UserService -- getuser');
      return $http.get("/api/user").then(
        function(response) {
          if (response.data.username) {
            // user has a current session on the server
            self.userObject.username = response.data.username;
            self.userObject.first_name = response.data.first_name;
            self.userObject.last_name = response.data.last_name;
            self.userObject.email = response.data.email;
            console.log(self.userObject);
            console.log(
              "UserService -- getuser -- User Data: ",
              response.data.id
            );
          } else {
            console.log("UserService -- getuser -- failure");
            // user has no session, bounce them back to the login page
            $location.path("/home");
          }
        },
        function(response) {
          console.log("UserService -- getuser -- failure: ", response);
          $location.path("/home");
        }
      );
    }),
      (self.logout = function() {
        console.log("UserService -- logout");
        swal({
          text: "Do you want to log out?",
          icon: "warning",
          buttons: ["No", "Yes"],
          dangerMode: true
        }).then(loggingOut => {
          if (loggingOut) {
            return $http.get("/api/user/logout").then(function(response) {
              swal("User was logged out!");
              self.getuser();
              $location.path("/home");
            });
          } else {
            swal({
              text: "User will remain logged in!",
              icon: "info"
            });
          }
        });
      });

    //Delete item from table/database
    self.deleteItem = function(eventid) {
      swal({
        text: "Are you sure you want to delete this Catch Data?",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: true
      }).then(deleting => {
        if (deleting) {
          return $http
            .delete(`/api/user/deleteItem/${eventid}`)
            .then(function(response) {
              swal("Catch data was deleted!");
              self.getCatch();
            })
            .catch(function(error) {
              // console.log('deleteItem error', error);
            });
        } else {
          swal({
            text: "No problem!  The data is safe!!",
            icon: "info",
            timer: 2000
          });
        }
      });
    };
  }
]);
