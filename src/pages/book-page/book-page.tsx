import { Navigation } from '../../components/navigation/navigation';
import { ArrowALeftIcon24Regular, UiMenuDots3HIcon24Regular } from '@skbkontur/icons';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { Page } from '../../ui/page/page';
import {getApiBooksSearchByIdBookId} from "../../generated-api/books/books.ts";

export const BookPage = () => {

  getApiBooksSearchByIdBookId("book")

  return (
    <Page>
      <Navigation customClass='nav-auto'>
        <ButtonIcon>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
        <ButtonIcon>
          <UiMenuDots3HIcon24Regular />
        </ButtonIcon>
      </Navigation>

      <div className='wrapper'>
        <div className='book-wrapper'>
          <img className='book-image' src='src/assets/book-example.png' />
          <div className='round-rect' />
        </div>
        <div className='content'>
          <div className='book-info'>
            <div className='book-header'>
              <div className='book-extra-info'>
                <p className='text-gray'>Оливия Лэнг</p>
                <p className='text-gray'>/</p>
                <p className='text-gray'>2021 г.</p>
              </div>
              <h1>Тело каждого. Книга о свободе</h1>
            </div>
            <div className='book-block'>
              <p className='text-gray'>Описание</p>
              <p>«Тело каждого. Книга о свободе» — это художественное исследование долгой борьбы за телесную свободу, от сексуального освобождения до феминизма и движения за гражданские права.</p>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </Page>
  );
}