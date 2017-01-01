import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  private debugUrl = ""
  private productionUrl = "http://www.frsf.utn.edu.ar/";
  private baseUrl = this.debugUrl;
  private headers: Headers = new Headers({
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  });

  constructor(public http: Http) { }


  private getJson(response: Response) {
    return response.json();
  }

  private checkForError(response: Response): Response | Observable<any> {

    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error['response'] = response;
      throw error;
    }
  }

  private get(path: string): Observable<any> {

    return this.http
      .get(`${this.baseUrl}${path}`, { headers: this.headers })
      .map(this.checkForError)
      .catch(err => Observable.throw(err))
      .map(this.getJson);
  }

  private post(path: string, body): Observable<any> {

    return this.http
      .post(`${this.baseUrl}${path}`, JSON.stringify(body), { headers: this.headers })
      .map(this.checkForError)
      .catch(err => Observable.throw(err))
      .map(this.getJson);
  }

  public getSubjects() {
    const path = 'getSubjects.php';
    return this.get(path);
  }

  public getDistribution(params: Object) {
    const path = 'getSubjects.php';
    this.headers.append("Content-type", "application/x-www-form-urlencoded");
    return this.post(path, params);
  }


}
