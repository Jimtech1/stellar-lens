import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { WalletType } from '@/lib/wallets';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
    const { login, loginWithWallet, isLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            toast.success('Logged in successfully');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWalletLogin = async (type: WalletType) => {
        setIsSubmitting(true);
        try {
            await loginWithWallet(type);
            toast.success('Wallet connected & logged in');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error('Wallet login failed');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Login to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="wallet" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="wallet">Connect Wallet</TabsTrigger>
                            <TabsTrigger value="email">Email</TabsTrigger>
                        </TabsList>

                        <TabsContent value="wallet" className="space-y-4 pt-4">
                            <Button
                                variant="outline"
                                className="w-full h-12 justify-start gap-3"
                                onClick={() => handleWalletLogin('freighter')}
                                disabled={isSubmitting}
                            >
                                <div className="text-xl">🚀</div>
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">Freighter</span>
                                    <span className="text-xs text-muted-foreground">Stellar Wallet</span>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-12 justify-start gap-3"
                                onClick={() => handleWalletLogin('metamask')}
                                disabled={isSubmitting}
                            >
                                <div className="text-xl">🦊</div>
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">MetaMask</span>
                                    <span className="text-xs text-muted-foreground">EVM Wallet</span>
                                </div>
                            </Button>
                        </TabsContent>

                        <TabsContent value="email" className="pt-4">
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Login
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => navigate('/register')}>
                        Don't have an account? Sign up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
