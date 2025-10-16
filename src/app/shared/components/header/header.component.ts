import {Component, ElementRef, output, viewChildren} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {recipes} from '../../models/recipe.model';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    logoClick = output<void>();
    inputRecipe = output<string | HTMLInputElement>();

    protected suggestionItems = viewChildren<ElementRef<HTMLLIElement>>('suggestionItem');

    protected recipeSuggestions = recipes;
    protected filteredRecipes: string[] = [];
    protected showSuggestions: boolean = false;
    protected selectedIndex: number = -1;

    protected onInput(event: Event) {
        const value = (event.target as HTMLInputElement).value.trim().toLowerCase();

        if (value === '') {
          this.filteredRecipes = this.recipeSuggestions;
        } else {
          this.filteredRecipes = this.recipeSuggestions.filter(recipe =>
            recipe.toLowerCase().includes(value)
          );
        }

        this.showSuggestions = true;
    }

    protected onFocus() {
        this.filteredRecipes = this.recipeSuggestions;
        this.showSuggestions = true;
    }

    protected onBlur() {
        setTimeout(() => {
          this.showSuggestions = false;
        }, 300);
    }

    protected onKeyDown(event: KeyboardEvent, input: HTMLInputElement) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % this.filteredRecipes.length;
          this.scrollToSelected();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + this.filteredRecipes.length) % this.filteredRecipes.length;
          this.scrollToSelected();
        } else if (event.key === 'Enter') {
          event.preventDefault();

          if (this.selectedIndex >= 0 && this.filteredRecipes.length > 0) {
            this.inputRecipe.emit(this.filteredRecipes[this.selectedIndex]);
          } else {
              this.inputRecipe.emit(input.value.trim());
          }

          input.value = '';
          this.selectedIndex = -1;
          this.showSuggestions = false;
        }
    }

    protected emitRecipe(recipe: string, input: HTMLInputElement) {
        this.inputRecipe.emit(recipe);
        input.value = '';
        this.selectedIndex = -1;
    }

    private scrollToSelected() {
        const items = this.suggestionItems();
        const selected = items[this.selectedIndex]?.nativeElement;
        if (selected) {
          selected.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
          });
        }
    }
}
