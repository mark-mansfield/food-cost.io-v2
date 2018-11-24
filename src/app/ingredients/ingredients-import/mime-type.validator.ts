import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

//  gett the value of the file,
//  read using file reade
//  check the mime typ eof the file

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObservable = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        // took this out because it was shwoing confusing results
        //  do mime type validation here
        // const arr = new Uint8Array(fileReader.result).subarray(0, 4);
        // let header = '';
        // let isValid = false;

        // for (let i = 0; i < arr.length; i++) {
        //   header += arr[i].toString(16);
        // }
        // console.log(file);
        // switch (header) {
        //   // xlsx
        //   case '504b34':
        //     console.log('xlsx selected');
        //     isValid = true;
        //     break;
        //   // csv
        //   case '696e6772':
        //     console.log('csv selected');
        //     isValid = true;
        //     break;
        //   case '89504e47':
        //     isValid = true;
        //     break;
        //   // numbers csv
        //   case '416e696d':
        //     isValid = true;
        //     break;

        //   default:
        //     isValid = false;
        //     break;
        // }
        let isValid = false;
        console.log(file.type);
        switch (file.type) {
          case 'text/csv':
            console.log('csv selected');
            isValid = true;
            break;

          default:
            isValid = false;
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });

      //  access the mime type using arrayBuffer
      fileReader.readAsArrayBuffer(file);
    }
  );
  return fileReaderObservable;
};
