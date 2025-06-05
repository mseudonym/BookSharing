namespace BS.Core.Errors.Validation;

public class SelfIsInvalidTarget()
    : ValidationError("SelfIsInvalidTarget", "You cannot perform this action on yourself.");