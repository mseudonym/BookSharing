namespace BS.Data.Entities.Notifications.Base;

// Прошла неделя вашего чтения книги (нет в базе)
//
// У вас новая заявка в друзья
// Ваша заявка в друзья принята
//
// Твой друг взял почитать книгу
// У друга новая книга

public abstract class NotificationEntityBase
{
    public Guid Id { get; set; }
    public Guid RecipientId { get; set; }
    public required UserEntity Recipient { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public bool IsDeleted { get; set; }
}