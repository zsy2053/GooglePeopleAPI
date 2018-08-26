import * as types from '../const'

export const handleAuthClick = function(event) {
  window.gapi.auth2.getAuthInstance().signIn().then(() => {
    return window.alert("You have signned in, please refresh the page to see the effect")
  })

}

export const handleSignoutClick = function(event) {
  window.gapi.auth2.getAuthInstance().signOut().then(() => {
    localStorage.removeItem("data_global")
    return window.alert("You have signned out, please refresh the page to see the effect")
  });
}

export const tmp_callBack = function(data) {
  localStorage.setItem("data_global", JSON.stringify(data))
}

export function listConnectionNames(tmp_callBack) {
  let data = []
  window.gapi.client.people.people.connections.list({
     'resourceName': 'people/me',
     'pageSize': 10,
     'personFields': 'names,genders,birthdays'
   }).then(function(response) {
     var connections = response.result.connections;
     if (connections && connections.length > 0) {
       for (let i = 0; i < connections.length; i++) {
         let item = {
           "resourceName": connections[i].resourceName,
           "name": connections[i].names ? connections[i].names[0]["displayName"] : "",
           "gender": connections[i].genders ? connections[i].genders[0]["formattedValue"] : "",
           "birthday": connections[i].birthdays ? connections[i].birthdays[0]["value"] : ""
         }
        data.push(item)
       }
       tmp_callBack(data)
     }
   })
}

export const displayMessage = function(event) {
  var contact_details = ["addresses", "ageRanges", "biographies", "birthdays", "braggingRights", "coverPhotos", "emailAddresses", "events", "genders", "imClients", "interests", "locales", "memberships", "metadata", "names", "nicknames", "occupations", "organizations", "phoneNumbers", "photos", "relations", "relationshipInterests", "relationshipStatuses", "residences", "sipAddresses", "skills", "taglines", "urls", "userDefined"]
  window.gapi.client.people.people.get({
    'resourceName': event.resourceName,
    'personFields': contact_details.toString()
  }).then(function(response) {
    const email = response.result.emailAddresses ? response.result.emailAddresses[0]["value"] : ""
    const displayName = response.result.names ? response.result.names[0]["displayName"] : ""
    const gender = response.result.genders ? response.result.genders[0]["value"] : ""
    const contactGroup = response.result.memberships ? response.result.memberships[0]["contactGroupMembership"]["contactGroupId"] : ""
    window.alert("Email: " + email +"\nName: " + displayName + "\nGender: " + gender +"\nContact Group: " + contactGroup)
  }).catch(function(err) {
    window.alert("Cannot find that person's info")
  })
}

export const deleteContact = function(value) {
  window.gapi.client.people.people.deleteContact({
    'resourceName': value
  }).then(function (res) {
    window.alert("Contact has been successfully deleted, please refresh the page to see the result");
  }).catch(function (err) {
    window.alert("Cannot delete that info");
  });
}

export const new_script = function(src) {
  var script = document.createElement('script');
  script.src = src;
  window.gapi.load('client:auth2', initClient)
  document.body.appendChild(script);
};

export const initClient = function() {
  window.gapi.client.init({
    apiKey: types.API_KEY,
    clientId: types.CLIENT_ID,
    discoveryDocs: types.DISCOVERY_DOCS,
    scope: types.SCOPE
  }).then(function () {
    window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    return updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  }).catch(function (err) {
    console.log(err)
  });
}

export const updateSigninStatus = function(isSignedIn) {
  if (isSignedIn) {
    return listConnectionNames(tmp_callBack)
  } else {
    window.is_signed = false
  }
}

export const createContact = function(user) {
  const format_gender = user.gender ? user.gender === "male" ? "Male" : "Female" : ""
  const hashValue = {
        "names": [
      {
        "displayName": user.first_name + ' ' + user.last_name,
        "familyName": user.last_name,
        "givenName": user.first_name,
        "displayNameLastFirst": user.last_name + " ," + user.first_name
      }
    ],
    "genders": [
      {
        "value": user.gender,
        "formattedValue": format_gender
      }
    ],
    "emailAddresses": [
      {
        "value": user.email,
        "displayName": user.email
      }
    ]
  }
  window.gapi.client.request({
    'method': 'POST',
    'path': 'https://people.googleapis.com/v1/people:createContact',
    'datatype': 'jsonp',
    'parent': 'new contact',
    'body': hashValue
  }).then(function (response) {
    if (response.status === 200) {
      window.alert('Contact has been successfully created, pls refresh the page to see the record')
    }
  }).catch(function (err) {
    window.alert('Cannot create that contact')
  })
}
