import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ResponseData {
  country: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  totalTests: number;
  testsPerOneMillion: number;
}

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css'],
})
export class CovidComponent implements OnInit {
  data: any;
  isActive = false;
  countryList = [];
  isLoading = false;

  country: string = 'Pakistan';
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  totalTests: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.countryList = [
      'World',
      'North America',
      'Europe',
      'Asia',
      'South America',
      'Africa',
      'USA',
      'Spain',
      'Italy',
      'Germany',
      'France',
      'UK',
      'China',
      'Iran',
      'Turkey',
      'Belgium',
      'Netherlands',
      'Switzerland',
      'Canada',
      'Brazil',
      'Russia',
      'Austria',
      'Israel',
      'India',
      'Australia',
      'Pakistan',
      'Saudi Arabia',
      'Portugal',
      'Peru',
      'Ireland',
      'Sweden',
      'Japan',
      'Chile',
      'S. Korea',
      'Singapore',
      'Poland',
      'Romania',
      'Mexico',
      'UAE',
      'Denmark',
      'Indonesia',
      'Norway',
      'Qatar',
      'Philippines',
      'Ukraine',
      'Malaysia',
      'Panama',
      'Colombia',
      'Finland',
      'Bangladesh',
      'Egypt',
      'South Africa',
      'Morocco',
      'Argentina',
      'Thailand',
      'Algeria',
      'Greece',
      'Kuwait',
      'hungary',
      'Oman',
      'Iraq',
      'New Zealand',
      'Afghanistan',
      'Cuba',
      'Taiwan',
    ];
    this.countryList.sort();

    this.isLoading = true;
    this.http
      .get<ResponseData>(
        'https://coronavirus-19-api.herokuapp.com/countries/Pakistan'
      )
      .subscribe((resData) => {
        this.cases = resData.cases;
        this.todayCases = resData.todayCases;
        this.deaths = resData.deaths;
        this.todayDeaths = resData.todayDeaths;
        this.recovered = resData.recovered;
        this.active = resData.active;
        this.critical = resData.critical;
        this.totalTests = resData.totalTests;
        this.isLoading = false;
      });
  }

  onDropdown() {
    this.isActive = !this.isActive;
  }

  onSelectCountry(country) {
    this.isLoading = true;
    this.http
      .get<ResponseData>(
        `https://coronavirus-19-api.herokuapp.com/countries/${country}`
      )
      .subscribe((resData) => {
        this.cases = resData.cases;
        this.todayCases = resData.todayCases;
        this.deaths = resData.deaths;
        this.todayDeaths = resData.todayDeaths;
        this.recovered = resData.recovered;
        this.active = resData.active;
        this.critical = resData.critical;
        this.totalTests = resData.totalTests;
        this.isLoading = false;
      });
    this.country = country;
  }
}
