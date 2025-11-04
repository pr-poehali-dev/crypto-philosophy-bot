import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
}

interface TradeSignal {
  type: 'buy' | 'sell';
  crypto: string;
  price: number;
  confidence: number;
  timestamp: string;
}

const Index = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 67234.50, change24h: 3.24, volume: 28500000000 },
    { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change24h: -1.45, volume: 15200000000 },
    { symbol: 'BNB', name: 'Binance Coin', price: 445.23, change24h: 2.15, volume: 1200000000 },
    { symbol: 'SOL', name: 'Solana', price: 156.89, change24h: 5.67, volume: 2400000000 },
  ]);

  const [portfolio] = useState({
    totalValue: 125840.50,
    totalProfit: 15234.20,
    profitPercent: 13.76,
  });

  const [aiSignals] = useState<TradeSignal[]>([
    { type: 'buy', crypto: 'BTC', price: 66800, confidence: 87, timestamp: '2 мин назад' },
    { type: 'sell', crypto: 'ETH', price: 3480, confidence: 92, timestamp: '5 мин назад' },
    { type: 'buy', crypto: 'SOL', price: 155, confidence: 78, timestamp: '12 мин назад' },
  ]);

  const [botActive, setBotActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.002),
        change24h: crypto.change24h + (Math.random() - 0.5) * 0.5,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CryptoTrader AI</h1>
            <p className="text-muted-foreground mt-1">Автоматическая торговая система</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={botActive ? "default" : "secondary"} className="px-4 py-2">
              <div className={`h-2 w-2 rounded-full mr-2 ${botActive ? 'bg-success animate-pulse-slow' : 'bg-muted-foreground'}`} />
              {botActive ? 'Бот активен' : 'Бот остановлен'}
            </Badge>
            <Button 
              variant={botActive ? "destructive" : "default"}
              onClick={() => setBotActive(!botActive)}
            >
              {botActive ? 'Остановить' : 'Запустить'}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Общий баланс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{formatPrice(portfolio.totalValue)}</div>
              <div className="flex items-center gap-1 mt-2">
                <Icon name="TrendingUp" className="h-4 w-4 text-success" />
                <span className="text-success font-medium">+{formatPrice(portfolio.totalProfit)}</span>
                <span className="text-muted-foreground text-sm">({portfolio.profitPercent}%)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Активных сделок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12</div>
              <div className="flex items-center gap-1 mt-2">
                <Icon name="Activity" className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">8 покупок / 4 продажи</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Прибыль за 24ч</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">+{formatPrice(2845.60)}</div>
              <div className="flex items-center gap-1 mt-2">
                <Icon name="BarChart3" className="h-4 w-4 text-success" />
                <span className="text-muted-foreground text-sm">+2.31% от портфеля</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="LineChart" className="h-5 w-5 text-primary" />
                Рыночные цены
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cryptoData.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary">{crypto.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">{formatPrice(crypto.price)}</div>
                      <div className={`text-sm font-medium ${crypto.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Объем 24ч</div>
                      <div className="font-medium text-foreground">{formatVolume(crypto.volume)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BrainCircuit" className="h-5 w-5 text-primary" />
                AI Сигналы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiSignals.map((signal, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border bg-secondary/30 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={signal.type === 'buy' ? 'default' : 'destructive'}>
                        {signal.type === 'buy' ? 'ПОКУПКА' : 'ПРОДАЖА'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{signal.timestamp}</span>
                    </div>
                    <div className="font-semibold text-foreground">{signal.crypto}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Цена: {formatPrice(signal.price)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${signal.type === 'buy' ? 'bg-success' : 'bg-destructive'}`}
                          style={{ width: `${signal.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{signal.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Icon name="Sparkles" className="h-4 w-4 mr-2" />
                Больше сигналов
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Settings" className="h-5 w-5 text-primary" />
              Настройки торгового бота
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Стратегия</div>
                <div className="font-semibold text-foreground">Агрессивная</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Макс. сделка</div>
                <div className="font-semibold text-foreground">{formatPrice(5000)}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Stop Loss</div>
                <div className="font-semibold text-foreground">-2.5%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
