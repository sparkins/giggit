$(document).ready(function () {

    // signUp
    $("#signupform").on("submit", function (event) {
        event.preventDefault();
        var username = $("#username").val().trim();
        var email = $("#email").val().trim();
        var password = $("#pass").val().trim();
        var isbus = $('input[name=bus]:checked').val()
        var data = {
            username: username,
            email: email,
            password: password,
            isbus: isbus
        }
        $.ajax("/signup", {
            type: "POST",
            data: data,
            success: function (response) {
                document.write(response);
                document.close();
                //location.reload(responce);
            },
            error: function (error) {

                alert(error.responseText)
            },
        }).then(function (data) {

        })
    })

    // Login 
    $(".loginform").on("submit", function (event) {
        event.preventDefault();
        var email = $("#emaillogin").val().trim();
        var password = $("#passlogin").val().trim();
        var data = {
            email: email,
            password: password
        }
        $.ajax("/signin", {
            type: "POST",
            data: data,
            success: function (response) {
               // document.open('text/plain');
                document.write(response)
                //location.reload(response)
                document.close();
            },
            error: function (error) {
                alert(error.responseText)
            },
        })
    })

    // logout
    $("#logoutlink").on("click", function () {
        $.ajax("/logout", {
            type: "Get",
            success: function (response) {
              
                document.write(response)
                document.close();
                // location.reload(response)
            }
        })
    })

    // Create a Review Page - user-review.handlebars
    // $("#ursubmit").on("click", function () {
    //     console.log('Review has been submitted');
    //     //     type: "Post",
    //     // })
    // })

  // Edit User Name
    $("#editusersubmit").on("click",function (event) {
        event.preventDefault();
        var username = $("#editnewusername").val().trim();
        var userId = $("#userIdhiden").val().trim();
        var data = {
                     username: username,
                     userId : userId
                   }
        $.ajax("/editusername", {
            type: "POST",
            data: data,
            success: function (responce) {
               alert(error.responseText)
            },
            error: function (error) {
                alert(error.responseText)
            },
        }) 
    })

    // Edit Email Address
    $("#editemailsubmit").on("click",function (event) {
        event.preventDefault();
        var email = $("#editemail").val().trim();
        var userId = $("#userIdhiden").val().trim();
        var data = {
                     email: email,
                     userId : userId
                   }
        $.ajax("/editemail", {
            type: "POST",
            data: data,
            success: function (responce) {
               alert(error.responseText)
            },
            error: function (error) {
                alert(error.responseText)
            },
        }) 
    })

     // Change password
     $("#editpasswordsubmit").on("click",function (event) {
        event.preventDefault();
        var userId = $("#userIdhiden").val().trim();
        var currentpassword = $("#currentpassword").val().trim();
        var newpassword = $("#newuserpassword").val().trim();
        var confirmpassword = $("#confirmuserpassword").val().trim();

        if(newpassword === confirmpassword){
        var data = {
                     userId : userId,
                     currentpassword : currentpassword,
                     newpassword : newpassword
                   }
        $.ajax("/changepassword", {
            type: "POST",
            data: data,
            success: function (responce) {
               alert(error.responseText)
            },
            error: function (error) {
                alert(error.responseText)
            },
        }) 
    }
    else{
        alert("password dosn't match");
    }
    })
})