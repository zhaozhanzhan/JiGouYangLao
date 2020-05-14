import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "RoomNamePipe" })
export class RoomNamePipe implements PipeTransform {
  transform(value: string): string {
    let index = value.indexOf("#");
    if (index != -1) {
      value = value.substr(index + 1);
    }
    return value;
  }
}
