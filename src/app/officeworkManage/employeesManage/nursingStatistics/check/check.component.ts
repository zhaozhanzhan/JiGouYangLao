import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  data; 
  nursingStatistics;
  name;
  ngOnInit() {

    let data = this.route.snapshot.paramMap.get('data');
    let nursingStatistics = this.route.snapshot.paramMap.get('nursingStatistics');
    let name = this.route.snapshot.paramMap.get('name');
  }



  back() {
    history.back();
  }
}
