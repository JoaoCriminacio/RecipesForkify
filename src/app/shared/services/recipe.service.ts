import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IRecipe, IRecipeDetail} from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
    private baseUrl: string = 'https://forkify-api.herokuapp.com/api/';

    constructor(private http: HttpClient) {}

    public get(name: string | HTMLInputElement) {
      return this.http.get<IRecipe>(`${this.baseUrl}search?q=${name}`);
    }

    public getDetail(id: string) {
      return this.http.get<IRecipeDetail>(`${this.baseUrl}get?rId=${id}`);
    }
}
