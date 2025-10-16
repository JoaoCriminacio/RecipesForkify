import {Component} from '@angular/core';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {RecipeService} from '../../shared/services/recipe.service';
import {LoaderService} from '../../shared/services/loader.service';
import {SnackBarService} from '../../shared/services/snack-bar.service';
import {LoaderComponent} from '../../shared/components/loader/loader.component';
import {SnackBarComponent} from '../../shared/components/snack-bar/snack-bar.component';
import {IRecipe, IRecipeDetail, IRecipeStorage, recipes} from '../../shared/models/recipe.model';
import {firstValueFrom} from 'rxjs';
import {DecimalPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    SnackBarComponent,
    NgClass,
    DecimalPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    protected currentRecipe: string | HTMLInputElement = '';
    protected recipes: IRecipe | null = null;
    protected recipeDetail: IRecipeDetail | null = null;
    protected shoppingList: IRecipeStorage[] = localStorage.getItem('shoppingList') ? JSON.parse(localStorage.getItem('shoppingList') || '[]') : [];

    constructor(private recipeService: RecipeService,
                private loaderService: LoaderService,
                private snackBarService: SnackBarService) {}

    protected async searchRecipe(recipe: string | HTMLInputElement) {
        try {
          this.loaderService.show();
          this.currentRecipe = recipe;
          this.recipes = await firstValueFrom(this.recipeService.get(recipe));
          await this.getRecipeDetail(this.recipes?.recipes?.[0].recipe_id);
        } catch (error) {
          this.recipes = null;
          this.recipeDetail = null;
          this.snackBarService.show('Error while searching recipe.', 'error');
        } finally {
          this.loaderService.hide();
        }
    }

    protected async getRecipeDetail(id: string) {
        if (this.recipeDetail?.recipe?.recipe_id === id) return;

        try {
          this.loaderService.show();
          this.recipeDetail = await firstValueFrom(this.recipeService.getDetail(id));
        } catch (error) {
          this.recipes = null;
          this.recipeDetail = null;
          this.snackBarService.show('Error while getting recipe detail.', 'error');
        } finally {
          this.loaderService.hide();
        }
    }

    protected addToShoppingList(title: string | undefined, url: string | undefined) {
        const list = JSON.parse(localStorage.getItem('shoppingList') || '[]');
        const alreadyExists = list.some((item: IRecipeStorage) => item.title === title);

        if (alreadyExists) return this.snackBarService.show('Recipe already exists in shopping list.', 'warning');

        const newList = [...list, { recipe: this.currentRecipe, title, url }];
        localStorage.setItem('shoppingList', JSON.stringify(newList));
        this.shoppingList = newList;
    }

    protected removeFromShoppingList(index: number) {
        const list = JSON.parse(localStorage.getItem('shoppingList') || '[]');
        list.splice(index, 1);
        localStorage.setItem('shoppingList', JSON.stringify(list));
        this.shoppingList = list;
    }
}
