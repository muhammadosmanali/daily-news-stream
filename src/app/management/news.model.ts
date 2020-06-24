export class NewsModel {
  constructor(
    public category: string,
    public newsSubject: string,
    public newsDetail1: string,
    public newsDetail2: string,
    public language: string,
    public views: number,
    public date: string,
    public realDate?: Date,
    public newsDetail3?: string,
    public ImagePath?: string,
  ) {}
}
