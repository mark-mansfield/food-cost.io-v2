import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

//  check the mime type of the file
// return null for valid
// return an object for invalid

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObservable = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
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
  });
  return fileReaderObservable;
};
