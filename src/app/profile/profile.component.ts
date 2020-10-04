import { Component, OnInit } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { HttpClient } from "@angular/common/http";
import { InteractionRequiredAuthError, AuthError } from "msal";

const GRAPH_ENDPOINT =
  "https://graph.microsoft.com/v1.0/me?$select=id,displayName,givenName,surname,jobTitle,userPrincipalName,mail,businessPhones,officeLocation,employeeId,department,companyName,streetAddress,city,state,postalCode,country";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  profile;

  constructor(private authService: MsalService, private http: HttpClient) {}

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT).subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err: AuthError) => {
        console.log("Errrrorrr", err);
        // If there is an interaction required error,
        // call one of the interactive methods and then make the request again.
        if (
          InteractionRequiredAuthError.isInteractionRequiredError(err.errorCode)
        ) {
          this.authService.acquireTokenRedirect({
            scopes: ["user.read", "openid", "profile"],
          });
        }
      },
    });
  }
}
