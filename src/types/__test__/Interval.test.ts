import Interval from '../Interval';

describe('Interval', () => {
  const i = Interval.from('180s');

  it('should throw if wrong arguments provided', () => {
    expect(() => Interval.from('1.5s')).toThrow(
      'String argument does not match interval pattern'
    );
  });

  describe('from method', () => {
    it('should return Result.Ok if correct args are given', () => {
      const i = Interval.from('10s');
      expect(
        i.matchWith({
          Error: () => null,
          Ok: ({ value }) => value.length,
        })
      ).toBe(10000);
    });

    it('should return Result.Error if wrong args are given', () => {
      const i = Interval.from('1.5s').getOrElse(null);
      expect(i).toBe(null);
    });
  });

  // it('should keep its length in milliseconds', () => {
  //   expect(i.length).toBe(180000);
  //   expect(Interval.from('1h').length).toBe(3600000);
  // });

  // it('should be divisible by another Interval', () => {
  //   const i2 = Interval.from('1m');
  //   expect(i.div(i2)).toBe(3);
  // });

  // it('should serialize into string and JSON representation correctly', () => {
  //   expect(JSON.stringify(i)).toBe(JSON.stringify('180s'));
  //   expect(i.toString()).toBe('180s');
  // });
});
